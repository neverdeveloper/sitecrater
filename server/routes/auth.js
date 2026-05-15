const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { 
  getUser, 
  getUserByEmail, 
  createUser, 
  saveSession,
  deleteSession,
  logLoginAttempt,
  getRecentFailedAttempts
} = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', 
  [
    body('username').trim().isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6, max: 100 }),
    body('role').optional().isIn(['Default', 'USER', 'ADMIN'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, role = 'Default', regDate } = req.body;

      const existingUser = await getUser(username);
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }

      const existingEmail = await getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).send('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      
      await createUser(username, email, hashedPassword, role, regDate || new Date().toISOString());

      res.status(201).send('User registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Registration failed');
    }
  }
);

router.post('/login',
  [
    body('username').trim().notEmpty(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      const ip = req.ip;

      const failedAttempts = await getRecentFailedAttempts(username);
      if (failedAttempts && failedAttempts.count >= 5) {
        return res.status(429).json({ message: 'Too many failed attempts. Try again later.' });
      }

      const user = await getUser(username);
      if (!user) {
        await logLoginAttempt(username, ip, 0);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        await logLoginAttempt(username, ip, 0);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      await logLoginAttempt(username, ip, 1);

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await saveSession(user.id, token, expiresAt);

      res.json({ 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          subscriptionEnd: user.subscriptionEnd
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  }
);

router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await deleteSession(req.token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
