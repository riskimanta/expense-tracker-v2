import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Database path
const dbPath = path.join(process.cwd(), 'expenses.db')

// Initialize database connection
function getDb() {
  return new Database(dbPath)
}

// PUT /api/account-types/[id] - Update account type
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Nama tipe akun harus diisi' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    
    // Check if account type exists
    const existingStmt = db.prepare('SELECT id FROM account_types WHERE id = ?')
    const existingAccountType = existingStmt.get(parseInt(id))
    
    if (!existingAccountType) {
      db.close()
      return NextResponse.json(
        { error: 'Account type not found' },
        { status: 404 }
      )
    }
    
    // Check if name already exists for other account types
    const nameCheckStmt = db.prepare('SELECT id FROM account_types WHERE name = ? AND id != ?')
    const nameExists = nameCheckStmt.get(name, parseInt(id))
    
    if (nameExists) {
      db.close()
      return NextResponse.json(
        { error: 'Account type name already exists' },
        { status: 409 }
      )
    }
    
    // Update account type
    const stmt = db.prepare(`
      UPDATE account_types 
      SET name = ?, updated_at = datetime('now')
      WHERE id = ?
    `)
    
    const result = stmt.run(name, parseInt(id))
    db.close()
    
    if (result.changes > 0) {
      return NextResponse.json({
        message: 'Account type updated successfully'
      })
    } else {
      throw new Error('Failed to update account type')
    }
  } catch (error) {
    console.error('Error updating account type:', error)
    return NextResponse.json(
      { error: 'Failed to update account type' },
      { status: 500 }
    )
  }
}

// DELETE /api/account-types/[id] - Delete account type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDb()
    
    // Check if account type exists
    const existingStmt = db.prepare('SELECT id, name, is_default FROM account_types WHERE id = ?')
    const existingAccountType = existingStmt.get(parseInt(id)) as { id: number; name: string; is_default: boolean } | undefined
    
    if (!existingAccountType) {
      db.close()
      return NextResponse.json(
        { error: 'Account type not found' },
        { status: 404 }
      )
    }
    
    // Check if it's a default account type
    if (existingAccountType.is_default) {
      db.close()
      return NextResponse.json(
        { error: 'Cannot delete default account type' },
        { status: 400 }
      )
    }
    
    // Check if account type is used by any accounts
    const accountsStmt = db.prepare('SELECT COUNT(*) as count FROM accounts WHERE type = ?')
    const accountsCount = accountsStmt.get(existingAccountType.name) as { count: number } | undefined
    
    if (accountsCount && accountsCount.count > 0) {
      db.close()
      return NextResponse.json(
        { error: `Cannot delete account type. It is used by ${accountsCount.count} account(s)` },
        { status: 409 }
      )
    }
    
    // Delete account type
    const stmt = db.prepare('DELETE FROM account_types WHERE id = ?')
    const result = stmt.run(parseInt(id))
    db.close()
    
    if (result.changes > 0) {
      return NextResponse.json({
        message: 'Account type deleted successfully'
      })
    } else {
      throw new Error('Failed to delete account type')
    }
  } catch (error) {
    console.error('Error deleting account type:', error)
    return NextResponse.json(
      { error: 'Failed to delete account type' },
      { status: 500 }
    )
  }
}
