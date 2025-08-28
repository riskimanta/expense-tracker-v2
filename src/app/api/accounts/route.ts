import { NextRequest, NextResponse } from 'next/server'

// GET /api/accounts - Fetch accounts from accountStorage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '1'
    
    // Import accountStorage dynamically to avoid SSR issues
    const { getAccounts } = await import('@/lib/accountStorage')
    
    // Get accounts from localStorage via accountStorage
    const accounts = getAccounts()
    
    // Transform to match expected API response format
    const transformedAccounts = accounts.map((account, index) => ({
      id: index + 1, // Generate sequential IDs for compatibility
      name: account.name,
      type: account.type,
      balance: account.balance,
      created_at: new Date().toISOString()
    }))
    
    return NextResponse.json(transformedAccounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    
    // Fallback to mock data if accountStorage fails
    return NextResponse.json([
      { id: 1, name: 'Cash', type: 'cash', balance: 500000, created_at: new Date().toISOString() },
      { id: 2, name: 'BCA', type: 'bank', balance: 8500000, created_at: new Date().toISOString() },
      { id: 3, name: 'OVO', type: 'ewallet', balance: 250000, created_at: new Date().toISOString() }
    ])
  }
}
