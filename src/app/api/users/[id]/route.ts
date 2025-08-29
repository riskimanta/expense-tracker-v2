import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'expenses.db')

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let db: Database.Database | null = null
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, role, status } = body

    // Validate required fields
    if (!name || !email || !role || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    db = new Database(dbPath)

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(id)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if email already exists for other users
    const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id)
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Update user
    const updateUser = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, role = ?, status = ?
      WHERE id = ?
    `)

    const result = updateUser.run(name, email, role, status, id)

    if (result.changes > 0) {
      // Return the updated user
      const updatedUser = db.prepare(`
        SELECT id, name, email, role, status, created_at as createdAt
        FROM users 
        WHERE id = ?
      `).get(id)

      return NextResponse.json(updatedUser)
    } else {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  } finally {
    if (db) {
      db.close()
    }
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let db: Database.Database | null = null
  try {
    const { id } = await params

    db = new Database(dbPath)

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(id)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user
    const deleteUser = db.prepare('DELETE FROM users WHERE id = ?')
    const result = deleteUser.run(id)

    if (result.changes > 0) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  } finally {
    if (db) {
      db.close()
    }
  }
}
