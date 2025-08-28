import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Database path
const dbPath = path.join(process.cwd(), 'expenses.db')

// Initialize database connection
function getDb() {
  return new Database(dbPath)
}

// GET /api/categories - Fetch categories with optional type filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'expense'
    
    const db = getDb()
    
    const query = `
      SELECT 
        id,
        name,
        color,
        type,
        icon
      FROM categories
      WHERE type = ?
      ORDER BY name
    `
    
    const stmt = db.prepare(query)
    const categories = stmt.all(type)
    db.close()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
