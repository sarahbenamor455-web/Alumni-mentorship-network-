const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'mentorship.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    role       TEXT NOT NULL CHECK (role IN ('student','alumni')),
    industry   TEXT,
    bio        TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS availability (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL,
    time_slot   TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role);
  CREATE INDEX IF NOT EXISTS idx_users_industry ON users(industry);
  CREATE INDEX IF NOT EXISTS idx_avail_user     ON availability(user_id);
  CREATE INDEX IF NOT EXISTS idx_avail_slot     ON availability(day_of_week, time_slot);
`);

// ---- Seed sample data (only runs when the table is empty) ----
const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;

if (count === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, role, industry, bio) VALUES (?, ?, ?, ?, ?)'
  );
  const insertSlot = db.prepare(
    'INSERT INTO availability (user_id, day_of_week, time_slot) VALUES (?, ?, ?)'
  );

  const industries = ['Software', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Education'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const slots = ['Morning', 'Afternoon', 'Evening'];
  const firstNames = ['Amina', 'Youssef', 'Sara', 'Karim', 'Leila', 'Omar', 'Nadia', 'Hedi', 'Ines', 'Mehdi'];
  const lastNames = ['Ben Ali', 'Trabelsi', 'Gharbi', 'Mansour', 'Jebali', 'Khelifi'];

  const seed = db.transaction(() => {
    for (let i = 0; i < 40; i++) {
      const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
      const role = i % 3 === 0 ? 'student' : 'alumni';
      const industry = industries[i % industries.length];
      const bio = role === 'alumni'
        ? `Experienced ${industry} professional offering resume review and weekly coaching.`
        : `Student interested in ${industry}, looking for portfolio feedback.`;
      const id = insertUser.run(name, `user${i}@university.edu`, role, industry, bio).lastInsertRowid;

      insertSlot.run(id, days[i % days.length], slots[i % slots.length]);
      insertSlot.run(id, days[(i + 2) % days.length], slots[(i + 1) % slots.length]);
    }
  });
  seed();
  console.log('Database seeded with 40 sample users.');
}

module.exports = db;