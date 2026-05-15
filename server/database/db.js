const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'private.db'), (err) => {
  if (err) {
    console.error('бля пиздец', err);
  } else {
    console.log('база данных подключена');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Default',
      regDate TEXT NOT NULL,
      subscription TEXT DEFAULT NULL,
      subscriptionEnd TEXT DEFAULT NULL,
      hwid TEXT DEFAULT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      ip TEXT NOT NULL,
      success INTEGER DEFAULT 0,
      attemptTime DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      type TEXT DEFAULT 'MONTH',
      duration INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      userId INTEGER DEFAULT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME NOT NULL,
      activatedAt DATETIME DEFAULT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
});

const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
};

const getUser = (username) => {
  return promisify(db.get.bind(db))('SELECT * FROM users WHERE username = ?', [username]);
};

const getUserById = (id) => {
  return promisify(db.get.bind(db))('SELECT * FROM users WHERE id = ?', [id]);
};

const getUserByEmail = (email) => {
  return promisify(db.get.bind(db))('SELECT * FROM users WHERE email = ?', [email]);
};

const createUser = (username, email, password, role, regDate) => {
  return promisify(db.run.bind(db))(
    'INSERT INTO users (username, email, password, role, regDate) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, role, regDate]
  );
};

const updateUserSubscription = (subscription, subscriptionEnd, id) => {
  return promisify(db.run.bind(db))(
    'UPDATE users SET subscription = ?, subscriptionEnd = ? WHERE id = ?',
    [subscription, subscriptionEnd, id]
  );
};

const updateUserHwid = (hwid, id) => {
  return promisify(db.run.bind(db))('UPDATE users SET hwid = ? WHERE id = ?', [hwid, id]);
};

const getUserCount = () => {
  return promisify(db.get.bind(db))('SELECT COUNT(*) as count FROM users');
};

const saveSession = (userId, token, expiresAt) => {
  return promisify(db.run.bind(db))(
    'INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
};

const getSession = (token) => {
  return promisify(db.get.bind(db))(
    'SELECT * FROM sessions WHERE token = ? AND expiresAt > datetime("now")',
    [token]
  );
};

const deleteSession = (token) => {
  return promisify(db.run.bind(db))('DELETE FROM sessions WHERE token = ?', [token]);
};

const deleteExpiredSessions = () => {
  return promisify(db.run.bind(db))('DELETE FROM sessions WHERE expiresAt <= datetime("now")');
};

const logLoginAttempt = (username, ip, success) => {
  return promisify(db.run.bind(db))(
    'INSERT INTO login_attempts (username, ip, success) VALUES (?, ?, ?)',
    [username, ip, success]
  );
};

const getRecentFailedAttempts = (username) => {
  return promisify(db.get.bind(db))(
    `SELECT COUNT(*) as count FROM login_attempts 
     WHERE username = ? AND success = 0 AND attemptTime > datetime('now', '-15 minutes')`,
    [username]
  );
};

const createKey = (key, type, duration, createdAt, expiresAt) => {
  return promisify(db.run.bind(db))(
    'INSERT INTO keys (key, type, duration, createdAt, expiresAt) VALUES (?, ?, ?, ?, ?)',
    [key, type, duration, createdAt, expiresAt]
  );
};

const getKey = (key) => {
  return promisify(db.get.bind(db))('SELECT * FROM keys WHERE key = ?', [key]);
};

const activateKey = (key, userId, activatedAt, subscriptionEnd) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('UPDATE keys SET used = 1, userId = ?, activatedAt = ? WHERE key = ?', 
        [userId, activatedAt, key], 
        (err) => {
          if (err) return reject(err);
          
          db.run('UPDATE users SET subscription = ?, subscriptionEnd = ?, role = ? WHERE id = ?',
            ['ACTIVE', subscriptionEnd, 'USER', userId],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        }
      );
    });
  });
};

const getAllKeys = () => {
  return promisify(db.all.bind(db))('SELECT * FROM keys ORDER BY createdAt DESC');
};

const deleteKey = (key) => {
  return promisify(db.run.bind(db))('DELETE FROM keys WHERE key = ?', [key]);
};

const getAllUsers = () => {
  return promisify(db.all.bind(db))('SELECT id, username, email, role, subscription, subscriptionEnd, regDate, createdAt FROM users ORDER BY createdAt DESC');
};

const deleteUser = (userId) => {
  return promisify(db.run.bind(db))('DELETE FROM users WHERE id = ?', [userId]);
};

const updateUserRole = (userId, role) => {
  return promisify(db.run.bind(db))('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
};

const grantUserSubscription = (userId, duration) => {
  const subscriptionEnd = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
  return promisify(db.run.bind(db))(
    'UPDATE users SET subscription = ?, subscriptionEnd = ?, role = ? WHERE id = ?',
    ['ACTIVE', subscriptionEnd, 'USER', userId]
  );
};

module.exports = {
  db,
  getUser,
  getUserById,
  getUserByEmail,
  createUser,
  updateUserSubscription,
  updateUserHwid,
  getUserCount,
  saveSession,
  getSession,
  deleteSession,
  deleteExpiredSessions,
  logLoginAttempt,
  getRecentFailedAttempts,
  createKey,
  getKey,
  activateKey,
  getAllKeys,
  deleteKey,
  getAllUsers,
  deleteUser,
  updateUserRole,
  grantUserSubscription
};
