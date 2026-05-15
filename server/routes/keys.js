const express = require('express');
const crypto = require('crypto');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { 
  createKey, 
  getKey, 
  activateKey, 
  getAllKeys,
  deleteKey
} = require('../database/db');

const router = express.Router();

// Генерация ключа (только для админов)
router.post('/generate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { duration, type = 'MONTH' } = req.body;
    
    if (!duration || duration <= 0) {
      return res.status(400).json({ message: 'Invalid duration' });
    }

    const key = crypto.randomBytes(16).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

    await createKey(key, type, duration, createdAt, expiresAt);

    res.json({ 
      key, 
      type, 
      duration, 
      createdAt, 
      expiresAt 
    });
  } catch (error) {
    console.error('Key generation error:', error);
    res.status(500).json({ message: 'Failed to generate key' });
  }
});

// Активация ключа
router.post('/activate', authMiddleware, async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ message: 'Key required' });
    }

    const keyData = await getKey(key);
    
    if (!keyData) {
      return res.status(404).json({ message: 'Key not found' });
    }

    if (keyData.used === 1) {
      return res.status(400).json({ message: 'Key already used' });
    }

    if (new Date(keyData.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Key expired' });
    }

    const userId = req.user.id;
    const activatedAt = new Date().toISOString();
    const subscriptionEnd = new Date(Date.now() + keyData.duration * 24 * 60 * 60 * 1000).toISOString();

    await activateKey(key, userId, activatedAt, subscriptionEnd);

    res.json({ 
      message: 'Key activated successfully',
      subscriptionEnd 
    });
  } catch (error) {
    console.error('Key activation error:', error);
    res.status(500).json({ message: 'Failed to activate key' });
  }
});

// Получить все ключи (только для админов)
router.get('/list', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const keys = await getAllKeys();
    res.json(keys);
  } catch (error) {
    console.error('Keys list error:', error);
    res.status(500).json({ message: 'Failed to fetch keys' });
  }
});

// Удалить ключ (только для админов)
router.delete('/:key', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    await deleteKey(key);
    res.json({ message: 'Key deleted successfully' });
  } catch (error) {
    console.error('Key deletion error:', error);
    res.status(500).json({ message: 'Failed to delete key' });
  }
});

module.exports = router;
