import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'expenses.db')
const db = new Database(dbPath)

// GET /api/budgets/[userId] - Get budget rule for specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const budget = db.prepare(`
      SELECT id, user_id as userId, needs, wants, savings, invest, coins, updated_at as updatedAt
      FROM budgets 
      WHERE user_id = ?
    `).get(userId)

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget rule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error fetching budget rule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budget rule' },
      { status: 500 }
    )
  }
}

// PUT /api/budgets/[userId] - Update budget rule for specific user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const body = await request.json()
    const { needs, wants, savings, invest, coins } = body

    // Validate required fields
    if (needs === undefined || wants === undefined || savings === undefined || invest === undefined || coins === undefined) {
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

    // Check if budget rule exists
    const existingBudget = db.prepare('SELECT id FROM budgets WHERE user_id = ?').get(userId)
    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget rule not found' },
        { status: 404 }
      )
    }

    // Update budget rule
    const updateBudget = db.prepare(`
      UPDATE budgets 
      SET needs = ?, wants = ?, savings = ?, invest = ?, coins = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `)

    const result = updateBudget.run(needs, wants, savings, invest, coins, userId)

    if (result.changes > 0) {
      // Return the updated budget rule
      const updatedBudget = db.prepare(`
        SELECT id, user_id as userId, needs, wants, savings, invest, coins, updated_at as updatedAt
        FROM budgets 
        WHERE user_id = ?
      `).get(userId)

      return NextResponse.json(updatedBudget)
    } else {
      return NextResponse.json(
        { error: 'Failed to update budget rule' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating budget rule:', error)
    return NextResponse.json(
      { error: 'Failed to update budget rule' },
      { status: 500 }
    )
  }
}
