import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'expenses.db')
const db = new Database(dbPath)

// GET /api/users - Get all users
export async function GET() {
  let db: Database.Database | null = null
  try {
    console.log('Connecting to database at:', dbPath)
    db = new Database(dbPath)
    console.log('Database connected successfully')
    
    // Check if users table exists, if not create it
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get()
    
    console.log('Table exists check:', tableExists)

    if (!tableExists) {
      console.log('Creating users table...')
      // Create users table if it doesn't exist
      db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          status TEXT NOT NULL DEFAULT 'active',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run()

      // Insert default users if table is empty
      const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
      console.log('User count:', userCount)
      
      if (userCount.count === 0) {
        console.log('Inserting default users...')
        const insertUser = db.prepare(`
          INSERT INTO users (id, name, email, role, status, created_at) 
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        
        insertUser.run('1', 'Admin User', 'admin@example.com', 'admin', 'active', '2024-01-01')
        insertUser.run('2', 'Regular User', 'user@example.com', 'user', 'active', '2024-01-02')
        console.log('Default users inserted')
      }
    }

    console.log('Fetching users from database...')
    // Check if the table has the new columns, if not, add them
    const hasRole = db.prepare("PRAGMA table_info(users)").all().some((col: unknown) => {
      const typedCol = col as { name: string }
      return typedCol.name === 'role'
    })
    
    if (!hasRole) {
      console.log('Adding missing columns to users table...')
      try {
        db.prepare('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"').run()
        db.prepare('ALTER TABLE users ADD COLUMN status TEXT DEFAULT "active"').run()
        db.prepare('ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP').run()
        console.log('Columns added successfully')
      } catch (alterError) {
        console.log('Some columns already exist:', alterError)
      }
    }

    const users = db.prepare(`
      SELECT id, name, email, 
             COALESCE(role, 'user') as role, 
             COALESCE(status, 'active') as status, 
             COALESCE(created_at, '2024-01-01') as createdAt
      FROM users 
      ORDER BY id DESC
    `).all()
    
    console.log('Users fetched:', users.length)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  } finally {
    if (db) {
      try {
        db.close()
        console.log('Database connection closed')
      } catch (closeError) {
        console.error('Error closing database:', closeError)
      }
    }
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  let db: Database.Database | null = null
  try {
    const body = await request.json()
    const { name, email, role, status } = body

    // Validate required fields
    if (!name || !email || !role || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    db = new Database(dbPath)

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Generate unique ID
    const id = Date.now().toString()

    // Insert new user
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, role, status, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)

    const result = insertUser.run(id, name, email, role, status)

    if (result.changes > 0) {
      // Return the created user
      const newUser = db.prepare(`
        SELECT id, name, email, role, status, created_at as createdAt
        FROM users 
        WHERE id = ?
      `).get(id)

      return NextResponse.json(newUser, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  } finally {
    if (db) {
      db.close()
    }
  }
}
