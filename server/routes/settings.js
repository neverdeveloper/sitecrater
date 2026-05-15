const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Сохранение настроек RAM (можно расширить для сохранения в БД)
router.post('/ram', authMiddleware, async (req, res) => {
  try {
    const { ramAmount } = req.body;
    
    if (!ramAmount || ramAmount < 512 || ramAmount > 16384) {
      return res.status(400).json({ message: 'Invalid RAM amount' });
    }

    // Здесь можно сохранить в БД если нужно
    // Пока просто возвращаем успех
    res.json({ 
      message: 'RAM settings saved',
      ramAmount 
    });
  } catch (error) {
    console.error('RAM settings error:', error);
    res.status(500).json({ message: 'Failed to save RAM settings' });
  }
});

module.exports = router;
