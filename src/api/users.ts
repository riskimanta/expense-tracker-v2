import { User } from '@/types/admin'





export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new Error('Failed to fetch users from database')
  }
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to create user:', error)
    throw new Error('Failed to create user in database')
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error('Failed to update user')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to update user:', error)
    throw new Error('Failed to update user in database')
  }
}

export async function deleteUser(id: string): Promise<string> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Failed to delete user')
    }
    return id
  } catch (error) {
    console.error('Failed to delete user:', error)
    throw new Error('Failed to delete user from database')
  }
}
