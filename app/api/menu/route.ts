import { db } from '@/lib/db';

export async function GET() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      category TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const { rows: existing } = await db.execute('SELECT COUNT(*) as count FROM menu_items');
  const count = Number((existing[0] as { count: number }).count);

  if (count === 0) {
    const defaultItems = [
      { name: 'Al Pastor Clásico', description: 'Cerdo marinado 24 horas con achiote, piña, y cilantro fresco', price: 45, category: 'Especialidades' },
      { name: 'Carne Asada de Rancho', description: 'Carne de res premium de Querétaro, asada a fuego de mesquite', price: 55, category: 'Especialidades' },
      { name: 'Barbacoa Tradicional', description: 'Borrego cocido lento 12 horas, servido con consomé y cebolla morada', price: 60, category: 'Especialidades' },
      { name: 'Suadero', description: 'Carne de res suave y jugosa, preparada con especias tradicionales', price: 48, category: 'Tacos Clásicos' },
      { name: 'Campechano', description: 'Mezcla de longaniza y carne asada con cebolla y cilantro', price: 50, category: 'Tacos Clásicos' },
      { name: 'Lengua', description: 'Lengua de res cocinada lentamente hasta quedar tierna', price: 52, category: 'Tacos Clásicos' },
      { name: 'Chorizo Artesanal', description: 'Chorizo casero elaborado con receta familiar', price: 42, category: 'Tacos Clásicos' },
      { name: 'Nopal con Queso', description: 'Nopal fresco a la plancha con queso Oaxaca fundido', price: 38, category: 'Vegetarianos' },
      { name: 'Rajas con Crema', description: 'Tiras de chile poblano con crema y elote', price: 40, category: 'Vegetarianos' },
      { name: 'Agua de Horchata', description: 'Bebida tradicional de arroz con canela', price: 35, category: 'Bebidas' },
      { name: 'Agua de Jamaica', description: 'Infusión de flor de jamaica', price: 35, category: 'Bebidas' },
      { name: 'Agua de Tamarindo', description: 'Refresco natural de tamarindo', price: 35, category: 'Bebidas' },
    ];

    for (const item of defaultItems) {
      await db.execute({
        sql: 'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
        args: [item.name, item.description, item.price, item.category],
      });
    }
  }

  const { rows } = await db.execute('SELECT * FROM menu_items ORDER BY category, id');
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      category TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.execute({
    sql: 'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
    args: [body.name, body.description ?? null, body.price ?? null, body.category],
  });

  return Response.json({ ok: true });
}
