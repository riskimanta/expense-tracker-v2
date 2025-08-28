import { User } from '@/types/admin'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Utama',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'User Demo',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'User Test',
    email: 'test@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-03T00:00:00Z'
  }
]

export function getUsers(): Promise<User[]> {
  return Promise.resolve(mockUsers)
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  mockUsers.push(newUser)
  return Promise.resolve(newUser)
}

export function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) {
    throw new Error('User not found')
  }
  mockUsers[index] = { ...mockUsers[index], ...updates }
  return Promise.resolve(mockUsers[index])
}

export function deleteUser(id: string): Promise<void> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) {
    throw new Error('User not found')
  }
  mockUsers.splice(index, 1)
  return Promise.resolve()
}
