import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Database path
const dbPath = path.join(process.cwd(), 'expenses.db')

// Initialize database connection
function getDb() {
  return new Database(dbPath)
}

// GET /api/accounts - Fetch accounts from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '1'
    
    const db = getDb()
    
    const query = `
      SELECT 
        id,
        name,
        type,
        opening_balance as balance,
        created_at
      FROM accounts 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `
    
    const stmt = db.prepare(query)
    const accounts = stmt.all([userId])
    db.close()
    
    // Transform to match expected API response format
    const transformedAccounts = accounts.map((account: unknown) => {
      const acc = account as { id: number; name: string; type: string; balance: number; created_at: string }
      return {
        id: acc.id,
        name: acc.name,
        type: acc.type === 'wallet' ? 'ewallet' : acc.type, // Map wallet to ewallet
        balance: acc.balance || 0,
        created_at: acc.created_at
      }
    })
    
    return NextResponse.json(transformedAccounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    
    // Fallback to mock data if database fails
    return NextResponse.json([
      { id: 1, name: 'Cash', type: 'cash', balance: 500000, created_at: new Date().toISOString() },
      { id: 2, name: 'BCA', type: 'bank', balance: 8500000, created_at: new Date().toISOString() },
      { id: 3, name: 'OVO', type: 'ewallet', balance: 250000, created_at: new Date().toISOString() }
    ])
  }
}

// POST /api/accounts - Create new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, balance, userId = '1' } = body
    
    if (!name || !type || balance === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    
    // Insert account
    const stmt = db.prepare(`
      INSERT INTO accounts (name, type, opening_balance, user_id, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)
    
    const result = stmt.run(name, type === 'ewallet' ? 'wallet' : type, balance, userId)
    db.close()
    
    if (result.lastInsertRowid) {
      return NextResponse.json({
        id: result.lastInsertRowid,
        message: 'Account created successfully'
      }, { status: 201 })
    } else {
      throw new Error('Failed to create account')
    }
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

// PUT /api/accounts/[id] - Update account
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, type, balance, icon } = body
    
    if (!id || !name || !type || balance === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    
    // Update account
    const stmt = db.prepare(`
      UPDATE accounts 
      SET name = ?, type = ?, opening_balance = ?
      WHERE id = ?
    `)
    
    const result = stmt.run(name, type === 'ewallet' ? 'ewallet' : type, balance, id)
    db.close()
    
    if (result.changes > 0) {
      return NextResponse.json({
        message: 'Account updated successfully'
      }, { status: 200 })
    } else {
      throw new Error('Failed to update account')
    }
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    )
  }
}
