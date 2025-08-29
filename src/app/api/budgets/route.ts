import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'expenses.db')
const db = new Database(dbPath)

// GET /api/budgets - Get all budget rules
export async function GET() {
  try {
    // Check if budgets table exists, if not create it
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='budgets'
    `).get()

    if (!tableExists) {
      // Create budgets table if it doesn't exist
      db.prepare(`
        CREATE TABLE IF NOT EXISTS budgets (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          needs INTEGER NOT NULL DEFAULT 50,
          wants INTEGER NOT NULL DEFAULT 25,
          savings INTEGER NOT NULL DEFAULT 15,
          invest INTEGER NOT NULL DEFAULT 5,
          coins INTEGER NOT NULL DEFAULT 5,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run()

      // Insert default budget rule if table is empty
      const budgetCount = db.prepare('SELECT COUNT(*) as count FROM budgets').get() as { count: number }
      
      if (budgetCount.count === 0) {
        const insertBudget = db.prepare(`
          INSERT INTO budgets (id, user_id, needs, wants, savings, invest, coins, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        
        insertBudget.run('1', '1', 50, 25, 15, 5, 5, '2024-01-01')
      }
    }

    const budgets = db.prepare(`
      SELECT id, user_id as userId, needs, wants, savings, invest, coins, updated_at as updatedAt
      FROM budgets 
      ORDER BY updated_at DESC
    `).all()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

// POST /api/budgets - Create new budget rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, needs, wants, savings, invest, coins } = body

    // Validate required fields
    if (!userId || needs === undefined || wants === undefined || savings === undefined || invest === undefined || coins === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate percentages add up to 100
    const total = needs + wants + savings + invest + coins
    if (total !== 100) {
      return NextResponse.json(
        { error: 'Budget percentages must add up to 100%' },
        { status: 400 }
      )
    }

    // Check if user already has a budget rule
    const existingBudget = db.prepare('SELECT id FROM budgets WHERE user_id = ?').get(userId)
    if (existingBudget) {
      return NextResponse.json(
        { error: 'User already has a budget rule' },
        { status: 409 }
      )
    }

    // Generate unique ID
    const id = Date.now().toString()

    // Insert new budget rule
    const insertBudget = db.prepare(`
      INSERT INTO budgets (id, user_id, needs, wants, savings, invest, coins, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)

    const result = insertBudget.run(id, userId, needs, wants, savings, invest, coins)

    if (result.changes > 0) {
      // Return the created budget rule
      const newBudget = db.prepare(`
        SELECT id, user_id as userId, needs, wants, savings, invest, coins, updated_at as updatedAt
        FROM budgets 
        WHERE id = ?
      `).get(id)

      return NextResponse.json(newBudget, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to create budget rule' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating budget rule:', error)
    return NextResponse.json(
      { error: 'Failed to create budget rule' },
      { status: 500 }
    )
  }
}
