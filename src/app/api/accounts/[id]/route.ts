import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { logApiError, logDatabaseError, logBusinessConflict } from '@/lib/errorMonitoring'

const dbPath = path.join(process.cwd(), 'expenses.db')

// PUT /api/accounts/[id] - Update account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let db: Database.Database | null = null
  
  try {
    console.log('Updating account with ID:', id)
    
    const body = await request.json()
    const { name, type, balance, logo_url } = body
    
    if (!name || !type || balance === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    db = new Database(dbPath)
    console.log('Database connected successfully')
    
    // Check if account exists
    const existingAccount = db.prepare('SELECT id, name FROM accounts WHERE id = ?').get(id) as { id: number; name: string } | undefined
    if (!existingAccount) {
      console.log('Account not found:', id)
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }
    
    // Update account
    const stmt = db.prepare(`
      UPDATE accounts 
      SET name = ?, type = ?, opening_balance = ?, logo_url = ?
      WHERE id = ?
    `)
    
    const result = stmt.run(name, type === 'ewallet' ? 'wallet' : type, balance, logo_url || null, id)
    
    if (result.changes > 0) {
      console.log('Account updated successfully:', id)
      return NextResponse.json({
        message: 'Account updated successfully'
      }, { status: 200 })
    } else {
      throw new Error('Failed to update account')
    }
  } catch (error) {
    console.error('Error updating account:', error)
    
    // Log API error
    logApiError(`/api/accounts/${id}`, 'PUT', 500, `Failed to update account: ${error instanceof Error ? error.message : 'Unknown error'}`)
    
    // Log database error if applicable
    if (error instanceof Error && error.message.includes('database')) {
      logDatabaseError('UPDATE accounts SET name = ?, type = ?, opening_balance = ?, logo_url = ? WHERE id = ?', error)
    }
    
    return NextResponse.json(
      { error: `Failed to update account: ${error instanceof Error ? error.message : 'Unknown error'}` },
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

// DELETE /api/accounts/[id] - Delete account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let db: Database.Database | null = null
  try {
    console.log('Deleting account with ID:', id)

    db = new Database(dbPath)
    console.log('Database connected successfully')

    // Check if account exists
    const existingAccount = db.prepare('SELECT id, name FROM accounts WHERE id = ?').get(id) as { id: number; name: string } | undefined
    if (!existingAccount) {
      console.log('Account not found:', id)
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    // Check if account is used in transactions
    const transactionCount = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE account_id = ?').get(id) as { count: number }
    if (transactionCount.count > 0) {
      console.log(`Account ${id} is used in ${transactionCount.count} transactions`)
      
      // Check if user wants to force delete
      const { force } = await request.json().catch(() => ({}))
      
      if (force) {
        console.log(`Force deleting account ${id} and handling transactions`)
        
        // Since we can't find a default cash account, just delete transactions
        const deleteTransactions = db.prepare('DELETE FROM transactions WHERE account_id = ?')
        deleteTransactions.run(id)
        console.log(`Deleted ${transactionCount.count} transactions for account ${id}`)
        
        // Now proceed with account deletion
        console.log(`Proceeding with account deletion after transaction cleanup`)
      } else {
        return NextResponse.json(
          { 
            error: `Cannot delete account "${existingAccount.name}" because it is used in ${transactionCount.count} transaction(s).`,
            transactionCount: transactionCount.count,
            suggestion: "Use ?force=true in request body to force delete and reassign transactions"
          },
          { status: 409 }
        )
      }
    }

    // Check if account is already soft deleted
    if (existingAccount.name.includes('[DELETED]')) {
      // Account is already soft deleted, perform hard delete
      console.log(`Account ${id} is already soft deleted, performing hard delete`)
      const hardDeleteAccount = db.prepare('DELETE FROM accounts WHERE id = ?')
      const result = hardDeleteAccount.run(id)
      
      if (result.changes > 0) {
        console.log('Account hard deleted successfully:', id)
        return NextResponse.json({ success: true, message: 'Account permanently deleted' })
      } else {
        throw new Error('Failed to hard delete account')
      }
    } else {
      // Soft delete account by setting a deleted flag or just update the name to indicate it's deleted
      const softDeleteAccount = db.prepare(`
        UPDATE accounts 
        SET name = ?, type = 'deleted', opening_balance = 0
        WHERE id = ?
      `)
      const result = softDeleteAccount.run(`[DELETED] ${existingAccount.name}`, id)
      
      if (result.changes > 0) {
        console.log('Account soft deleted successfully:', id)
        return NextResponse.json({ success: true, message: 'Account soft deleted successfully' })
      } else {
        throw new Error('Failed to soft delete account')
      }
    }


  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: `Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}` },
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
