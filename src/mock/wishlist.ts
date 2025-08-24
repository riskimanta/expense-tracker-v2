export interface WishlistItem {
  id: string
  name: string
  estimatedPrice: number
  priority: 'low' | 'medium' | 'high'
  targetDate: string
  status: 'pending' | 'saving' | 'achieved'
  notes?: string
  category: string
  currentSavings: number
  createdAt: string
}

export const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    estimatedPrice: 25000000,
    priority: 'high',
    targetDate: '2025-12-31',
    status: 'saving',
    notes: 'Upgrade dari iPhone 12, butuh untuk fotografi',
    category: 'Electronics',
    currentSavings: 15000000,
    createdAt: '2025-01-15'
  },
  {
    id: '2',
    name: 'Liburan ke Bali',
    estimatedPrice: 8000000,
    priority: 'medium',
    targetDate: '2025-06-30',
    status: 'saving',
    notes: 'Weekend getaway dengan keluarga',
    category: 'Travel',
    currentSavings: 3000000,
    createdAt: '2025-02-01'
  },
  {
    id: '3',
    name: 'Laptop Gaming',
    estimatedPrice: 18000000,
    priority: 'low',
    targetDate: '2026-03-31',
    status: 'pending',
    notes: 'Untuk gaming dan development',
    category: 'Electronics',
    currentSavings: 0,
    createdAt: '2025-03-10'
  },
  {
    id: '4',
    name: 'Motor Vespa',
    estimatedPrice: 35000000,
    priority: 'high',
    targetDate: '2025-10-31',
    status: 'saving',
    notes: 'Transportasi harian yang stylish',
    category: 'Vehicle',
    currentSavings: 20000000,
    createdAt: '2025-01-20'
  },
  {
    id: '5',
    name: 'Investasi Emas',
    estimatedPrice: 10000000,
    priority: 'medium',
    targetDate: '2025-12-31',
    status: 'saving',
    notes: 'Diversifikasi portfolio investasi',
    category: 'Investment',
    currentSavings: 5000000,
    createdAt: '2025-02-15'
  }
]

export const mockWishlistCategories = [
  'Electronics',
  'Travel',
  'Vehicle',
  'Investment',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Other'
]

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-[var(--danger)] bg-[var(--danger)]/10 border-[var(--danger)]'
    case 'medium':
      return 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]'
    case 'low':
      return 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]'
    default:
      return 'text-[var(--txt-med)] bg-muted border-border'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'achieved':
      return 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]'
    case 'saving':
      return 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]'
    case 'pending':
      return 'text-[var(--txt-med)] bg-muted border-border'
    default:
      return 'text-[var(--txt-med)] bg-muted border-border'
  }
}

export const getProgressPercentage = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100)
}
