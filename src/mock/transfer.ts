

export interface TransferTransaction {
  id: string
  date: string
  fromAccount: string
  toAccount: string
  amount: number
  fee: number
  description: string
  status: 'completed' | 'pending' | 'failed'
}

export const mockTransferTransactions: TransferTransaction[] = [
  {
    id: '1',
    date: '2025-01-18',
    fromAccount: 'BCA',
    toAccount: 'OVO',
    amount: 1000000,
    fee: 2500,
    description: 'Transfer ke e-wallet untuk belanja online',
    status: 'completed'
  },
  {
    id: '2',
    date: '2025-01-17',
    fromAccount: 'Cash',
    toAccount: 'BCA',
    amount: 500000,
    fee: 0,
    description: 'Setor tunai ke rekening bank',
    status: 'completed'
  },
  {
    id: '3',
    date: '2025-01-16',
    fromAccount: 'BCA',
    toAccount: 'GoPay',
    amount: 200000,
    fee: 1500,
    description: 'Top up GoPay untuk transport',
    status: 'completed'
  },
  {
    id: '4',
    date: '2025-01-15',
    fromAccount: 'OVO',
    toAccount: 'BCA',
    amount: 750000,
    fee: 2000,
    description: 'Tarik dana dari e-wallet ke bank',
    status: 'completed'
  },
  {
    id: '5',
    date: '2025-01-14',
    fromAccount: 'BCA',
    toAccount: 'Cash',
    amount: 300000,
    fee: 0,
    description: 'Tarik tunai dari ATM',
    status: 'completed'
  }
]

export const mockAccounts = [
  { id: 'cash', name: 'Cash', type: 'cash', balance: 2500000 },
  { id: 'bca', name: 'BCA', type: 'bank', balance: 8500000 },
  { id: 'ovo', name: 'OVO', type: 'ewallet', balance: 1500000 },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', balance: 800000 }
]
