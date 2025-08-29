import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'expenses.db')
const db = new Database(dbPath)

// GET /api/currencies - Get all currencies
export async function GET() {
  try {
    // Check if currencies table exists, if not create it
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='currencies'
    `).get()

    if (!tableExists) {
      // Create currencies table if it doesn't exist
      db.prepare(`
        CREATE TABLE IF NOT EXISTS currencies (
          code TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          symbol TEXT NOT NULL,
          rate_to_idr REAL NOT NULL DEFAULT 1,
          is_default BOOLEAN DEFAULT FALSE,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `).run()

      // Insert default currencies if table is empty
      const currencyCount = db.prepare('SELECT COUNT(*) as count FROM currencies').get() as { count: number }
      
      if (currencyCount.count === 0) {
        const insertCurrency = db.prepare(`
          INSERT INTO currencies (code, name, symbol, rate_to_idr, is_default, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        
        insertCurrency.run('IDR', 'Indonesian Rupiah', 'Rp', 1, true, '2024-01-01')
        insertCurrency.run('USD', 'US Dollar', '$', 15000, false, '2024-01-01')
        insertCurrency.run('EUR', 'Euro', '€', 16500, false, '2024-01-01')
      }
    }

    const currencies = db.prepare(`
      SELECT code, name, symbol, rate_to_idr as rateToIDR, is_default as isDefault, updated_at as updatedAt
      FROM currencies 
      ORDER BY is_default DESC, name ASC
    `).all()

    return NextResponse.json(currencies)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    )
  }
}

// POST /api/currencies - Create new currency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, symbol, rateToIDR, isDefault } = body

    // Validate required fields
    if (!code || !name || !symbol || rateToIDR === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if currency code already exists
    const existingCurrency = db.prepare('SELECT code FROM currencies WHERE code = ?').get(code)
    if (existingCurrency) {
      return NextResponse.json(
        { error: 'Currency code already exists' },
        { status: 409 }
      )
    }

    // If this is default, unset other defaults
    if (isDefault) {
      db.prepare('UPDATE currencies SET is_default = FALSE').run()
    }

    // Insert new currency
    const insertCurrency = db.prepare(`
      INSERT INTO currencies (code, name, symbol, rate_to_idr, is_default, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)

    const result = insertCurrency.run(code, name, symbol, rateToIDR, isDefault || false)

    if (result.changes > 0) {
      // Return the created currency
      const newCurrency = db.prepare(`
        SELECT code, name, symbol, rate_to_idr as rateToIDR, is_default as isDefault, updated_at as updatedAt
        FROM currencies 
        WHERE code = ?
      `).get(code)

      return NextResponse.json(newCurrency, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to create currency' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating currency:', error)
    return NextResponse.json(
      { error: 'Failed to create currency' },
      { status: 500 }
    )
  }
}
