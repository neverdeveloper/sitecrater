const express = require('express');
const { getUserById, getUserCount, updateUserHwid } = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.get('/getNumberUser', async (req, res) => {
  try {
    const result = await getUserCount();
    res.send(result.count.toString());
  } catch (error) {
    console.error('User count error:', error);
    res.status(500).send('0');
  }
});

router.post('/updateHwid', authMiddleware, async (req, res) => {
  try {
    const { hwid } = req.body;
    
    if (!hwid || hwid.length < 10) {
      return res.status(400).json({ message: 'Invalid HWID' });
    }

    await updateUserHwid(hwid, req.user.id);
    res.json({ message: 'HWID updated successfully' });
  } catch (error) {
    console.error('HWID update error:', error);
    res.status(500).json({ message: 'Failed to update HWID' });
  }
});

router.post('/sub', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscription && user.subscriptionEnd) {
      const now = new Date();
      const endDate = new Date(user.subscriptionEnd);
      
      if (endDate > now) {
        return res.json({
          sub: {
            entDate: user.createdAt,
            outDate: user.subscriptionEnd
          }
        });
      }
    }

    res.json({ sub: null });
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ message: 'Failed to check subscription' });
  }
});

module.exports = router;
