import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Database path
const dbPath = path.join(process.cwd(), 'expenses.db')

// Initialize database connection
function getDb() {
  return new Database(dbPath)
}

// GET /api/transactions/[id] - Fetch single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDb()
    
    const stmt = db.prepare(`
      SELECT 
        t.id,
        t.date,
        t.amount,
        t.note as description,
        t.type,
        t.category_id,
        c.name as category_name,
        t.account_id,
        a.name as account_name,
        t.created_at,
        t.transfer_group
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.id = ?
    `)
    
    const transaction = stmt.get(id)
    db.close()
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

// PATCH /api/transactions/[id] - Update transaction
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { date, categoryId, amount, description, accountId, type } = body
    
    if (!date || !categoryId || !amount || !accountId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    
    // Update transaction
    const stmt = db.prepare(`
      UPDATE transactions 
      SET 
        date = ?,
        category_id = ?,
        amount = ?,
        note = ?,
        account_id = ?,
        type = ?
      WHERE id = ?
    `)
    
    const result = stmt.run(date, categoryId, amount, description || '', accountId, type, id)
    db.close()
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    // Fetch updated transaction
    const updatedDb = getDb()
    const fetchStmt = updatedDb.prepare(`
      SELECT 
        t.id,
        t.date,
        t.amount,
        t.note as description,
        t.type,
        t.category_id,
        c.name as category_name,
        t.account_id,
        a.name as account_name,
        t.created_at,
        t.transfer_group
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.id = ?
    `)
    
    const updatedTransaction = fetchStmt.get(id)
    updatedDb.close()
    
    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDb()
    
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?')
    const result = stmt.run(id)
    db.close()
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
