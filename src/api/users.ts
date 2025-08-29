import { User } from '@/types/admin'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Mock data moved inline
const mockUsers = {
  getUsers: (): User[] => [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-02'
    }
  ],
  createUser: (user: Omit<User, 'id' | 'createdAt'>): User => ({
    id: Date.now().toString(),
    ...user,
    createdAt: new Date().toISOString().split('T')[0]
  }),
  updateUser: (id: string, updates: Partial<User>): User => ({
    id,
    name: 'Updated User',
    email: 'updated@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01',
    ...updates
  })
}

export async function getUsers(): Promise<User[]> {
  if (!API_URL) {
    return mockUsers.getUsers()
  }

  try {
    const response = await fetch(`${API_URL}/api/users`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error)
    return mockUsers.getUsers()
  }
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
