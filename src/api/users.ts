import { User } from '@/types/admin'
import * as mockUsers from '@/mock/users'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getUsers(): Promise<User[]> {
  if (!API_URL) {
    return mockUsers.getUsers()
  }

  const response = await fetch(`${API_URL}/api/users`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  if (!API_URL) {
    return mockUsers.createUser(user)
  }

  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (!response.ok) {
    throw new Error('Failed to create user')
  }
  return response.json()
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  if (!API_URL) {
    return mockUsers.updateUser(id, updates)
  }

  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  return response.json()
}

export async function deleteUser(id: string): Promise<void> {
  if (!API_URL) {
    return mockUsers.deleteUser(id)
  }

  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}
