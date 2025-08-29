import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Database path
const dbPath = path.join(process.cwd(), 'expenses.db')

// Initialize database connection
function getDb() {
  return new Database(dbPath)
}

// GET /api/account-types - Fetch all account types
export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    
    const query = `
      SELECT 
        id,
        name,
        created_at,
        updated_at
      FROM account_types 
      ORDER BY name ASC
    `
    
    const stmt = db.prepare(query)
    const accountTypes = stmt.all()
    db.close()
    
    return NextResponse.json(accountTypes)
  } catch (error) {
    console.error('Error fetching account types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account types' },
      { status: 500 }
    )
  }
}

// POST /api/account-types - Create new account type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Nama tipe akun harus diisi' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    
    // Check if name already exists
    const existingStmt = db.prepare('SELECT id FROM account_types WHERE name = ?')
    const existing = existingStmt.get(name)
    
    if (existing) {
      db.close()
      return NextResponse.json(
        { error: 'Account type name already exists' },
        { status: 409 }
      )
    }
    
    // Insert account type
    const stmt = db.prepare(`
      INSERT INTO account_types (name, created_at, updated_at)
      VALUES (?, datetime('now'), datetime('now'))
    `)
    
    const result = stmt.run(name)
    db.close()
    
    if (result.lastInsertRowid) {
      return NextResponse.json({
        id: result.lastInsertRowid,
        message: 'Account type created successfully'
      }, { status: 201 })
    } else {
      throw new Error('Failed to create account type')
    }
  } catch (error) {
    console.error('Error creating account type:', error)
    return NextResponse.json(
      { error: 'Failed to create account type' },
      { status: 500 }
    )
  }
}
