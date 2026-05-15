require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require('crypto');
const { deleteExpiredSessions } = require('./database/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const keysRoutes = require('./routes/keys');
const settingsRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8127;

// Генерация случайного пути для админки
let currentAdminPath = generateAdminPath();
let adminPathExpiry = Date.now() + 10 * 60 * 1000; // 10 минут

function generateAdminPath() {
  return crypto.randomBytes(8).toString('hex');
}

function updateAdminPath() {
  currentAdminPath = generateAdminPath();
  adminPathExpiry = Date.now() + 10 * 60 * 1000;
  console.log(`новый путь к админке: /${currentAdminPath} (меняется каждые 10 минет)`);
}

// Обновление пути каждые 10 минут
setInterval(updateAdminPath, 10 * 60 * 1000);

console.log(`путь к админке /${currentAdminPath}`);

app.use(express.static(path.join(__dirname, '..')));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'", "'unsafe-hashes'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://privatedlc.xyz', 'https://www.privatedlc.xyz']
    : '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

setInterval(() => {
  try {
    deleteExpiredSessions.run();
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
}, 60 * 60 * 1000);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/keys', keysRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/cabinet', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'cabinet', 'cabinet.html'));
});

app.get('/eula', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'eula', 'eula.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'product', 'product.html'));
});

app.get('/eula', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'eula', 'eula.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'admin.html'));
});

// Динамический путь админки
app.get(`/:adminPath`, (req, res, next) => {
  if (req.params.adminPath === currentAdminPath) {
    return res.sendFile(path.join(__dirname, '..', 'admin', 'admin.html'));
  }
  next();
});

// API для получения текущего пути админки (только для админов)
app.get('/api/admin/path', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const jwt = require('jsonwebtoken');
    const { getUserById, getSession } = require('./database/db');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await getSession(token);
    
    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const user = await getUserById(decoded.userId);
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ 
      path: currentAdminPath,
      expiresIn: Math.floor((adminPathExpiry - Date.now()) / 1000)
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`сервер запущен на порту ${PORT}`);
});

module.exports = app;
