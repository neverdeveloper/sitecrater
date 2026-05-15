const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'private.db'));

const username = process.argv[2];

if (!username) {
  console.log('Usage: node make-admin.js <username>');
  process.exit(1);
}

db.run('UPDATE users SET role = ? WHERE username = ?', ['ADMIN', username], function(err) {
  if (err) {
    console.error('Error:', err);
  } else if (this.changes === 0) {
    console.log(`User "${username}" not found`);
  } else {
    console.log(`✅ User "${username}" is now ADMIN`);
  }
  db.close();
});
