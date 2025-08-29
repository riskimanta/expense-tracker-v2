import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Database path
const dbPath = path.join(process.cwd(), 'expenses.db')

// Initialize database connection
function getDb() {
  return new Database(dbPath)
}

// GET /api/transactions - Fetch transactions with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'EXPENSE'
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const userId = searchParams.get('userId')
    const categoryId = searchParams.get('categoryId')
    const accountId = searchParams.get('accountId')

    const db = getDb()
    
    let query = `
      SELECT 
        t.id,
        t.date,
        t.amount,
        t.note as description,
        t.category_id,
        c.name as category_name,
        t.account_id,
        a.name as account_name,
        a.opening_balance as balance,
        t.type,
        t.created_at,
        t.transfer_group
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.type = ?
    `
    
    const params: (string | number)[] = [type]
    
    if (userId) {
      query += ' AND t.user_id = ?'
      params.push(userId)
    }
    
    if (from) {
      query += ' AND t.date >= ?'
      params.push(from)
    }
    
    if (to) {
      query += ' AND t.date <= ?'
      params.push(to)
    }
    
    if (categoryId && categoryId !== 'all') {
      query += ' AND t.category_id = ?'
      params.push(categoryId)
    }
    
    if (accountId && accountId !== 'all') {
      query += ' AND t.account_id = ?'
      params.push(accountId)
    }
    
    query += ' ORDER BY t.date DESC'
    
    const stmt = db.prepare(query)
    const transactions = stmt.all(params)
    db.close()
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, categoryId, amount, description, accountId, userId = '1', type = 'EXPENSE' } = body
    
    if (!date || !categoryId || !amount || !accountId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    
    // Insert transaction
    const stmt = db.prepare(`
      INSERT INTO transactions (
        date, category_id, amount, note, account_id, user_id, type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)
    
    const result = stmt.run(date, categoryId, amount, description || '', accountId, userId, type)
    db.close()
    
    if (result.lastInsertRowid) {
      return NextResponse.json({
        id: result.lastInsertRowid,
        message: 'Transaction created successfully'
      }, { status: 201 })
    } else {
      throw new Error('Failed to create transaction')
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
