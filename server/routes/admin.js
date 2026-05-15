const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { 
  getAllUsers,
  deleteUser,
  updateUserRole,
  grantUserSubscription
} = require('../database/db');

const router = express.Router();

// Получить всех пользователей
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Удалить пользователя
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    await deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Изменить роль пользователя
router.patch('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['Default', 'USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    await updateUserRole(id, role);
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// Выдать подписку пользователю
router.post('/users/:id/subscription', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;
    
    if (!duration || duration <= 0) {
      return res.status(400).json({ message: 'Invalid duration' });
    }
    
    await grantUserSubscription(id, duration);
    res.json({ message: 'Subscription granted successfully' });
  } catch (error) {
    console.error('Subscription grant error:', error);
    res.status(500).json({ message: 'Failed to grant subscription' });
  }
});

module.exports = router;
