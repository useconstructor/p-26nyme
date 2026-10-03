import { db } from '@/lib/db';

export async function GET() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const { rows } = await db.execute('SELECT * FROM reservations ORDER BY date DESC, time DESC');
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.execute({
    sql: 'INSERT INTO reservations (name, email, phone, location, date, time, party_size, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [
      body.name,
      body.email,
      body.phone ?? null,
      body.location,
      body.date,
      body.time,
      body.party_size,
      body.notes ?? null,
    ],
  });

  return Response.json({ ok: true });
}
