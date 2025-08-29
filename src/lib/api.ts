// API utility functions
export const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export const api = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 
      "Content-Type": "application/json", 
      ...(init?.headers || {}) 
    },
    cache: "no-store",
  });

// Transaction API functions
export const transactionApi = {
  // Get transactions with filters
  getTransactions: async (params: {
    type?: string;
    from?: string;
    to?: string;
    userId?: string;
    categoryId?: string;
    accountId?: string;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    const response = await api(`/api/transactions?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  },

  // Create new transaction
  createTransaction: async (data: {
    date: string;
    categoryId: string;
    amount: number;
    description: string;
    accountId: string;
    userId?: string;
    type?: string;
  }) => {
    const response = await api('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }
    return response.json();
  },

  // Get single transaction
  getTransaction: async (id: string) => {
    const response = await api(`/api/transactions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }
    return response.json();
  },

  // Update transaction
  updateTransaction: async (id: string, data: {
    date: string;
    categoryId: string;
    amount: number;
    description: string;
    accountId: string;
    type: string;
  }) => {
    const response = await api(`/api/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }
    return response.json();
  },

  // Delete transaction
  deleteTransaction: async (id: string) => {
    const response = await api(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json()
        
        // For 409 Conflict, return the error data instead of throwing
        if (response.status === 409) {
          return { success: false, error: errorData.error, status: response.status }
        }
        
        // For other errors, throw with informative message
        throw new Error(errorData.error || `Failed to delete transaction (${response.status})`)
      } catch (parseError) {
        // If we can't parse the error response, throw generic error
        throw new Error(`Failed to delete transaction (${response.status})`)
      }
    }
    return response.json();
  },
};

// Category API functions
export const categoryApi = {
  getCategories: async (type?: string) => {
    const params = type ? `?type=${type}` : '';
    const response = await api(`/api/categories${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
};

// Account API functions
export const accountApi = {
  getAccounts: async (userId?: string) => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await api(`/api/accounts${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    return response.json();
  },

  createAccount: async (data: {
    name: string;
    type: string;
    balance: number;
    userId?: string;
  }) => {
    const response = await api('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json()
        
        // For 409 Conflict (e.g., duplicate name), return the error data instead of throwing
        if (response.status === 409) {
          return { success: false, error: errorData.error, status: response.status }
        }
        
        // For other errors, throw with informative message
        throw new Error(errorData.error || `Failed to create account (${response.status})`)
      } catch (parseError) {
        // If we can't parse the error response, throw generic error
        throw new Error(`Failed to create account (${response.status})`)
      }
    }
    return response.json();
  },

  updateAccount: async (id: string, data: {
    name?: string;
    type?: string;
    balance?: number;
    icon?: string;
  }) => {
    const response = await api(`/api/accounts`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    });
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json()
        
        // For 409 Conflict (e.g., duplicate name), return the error data instead of throwing
        if (response.status === 409) {
          return { success: false, error: errorData.error, status: response.status }
        }
        
        // For other errors, throw with informative message
        throw new Error(errorData.error || `Failed to update account (${response.status})`)
      } catch (parseError) {
        // If we can't parse the error response, throw generic error
        throw new Error(`Failed to update account (${response.status})`)
      }
    }
    return response.json();
  },

  deleteAccount: async (id: string) => {
    const response = await api(`/api/accounts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json()
        
        // For 409 Conflict, return the error data instead of throwing
        if (response.status === 409) {
          return { success: false, error: errorData.error, status: response.status }
        }
        
        // For other errors, throw with informative message
        throw new Error(errorData.error || `Failed to delete account (${response.status})`)
      } catch (parseError) {
        // If we can't parse the error response, throw generic error
        throw new Error(`Failed to delete account (${response.status})`)
      }
    }
    return response.json();
  },
};
