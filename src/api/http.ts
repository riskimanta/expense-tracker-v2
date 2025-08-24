const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // If no API URL is configured, throw error to trigger mock fallback
  if (!API_BASE_URL) {
    throw new ApiError('No API URL configured', 0)
  }

  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      )
    }

    const data = await response.json()
    return {
      data,
      success: true,
      message: 'Success'
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

export async function apiPost<T>(
  endpoint: string, 
  data: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiPut<T>(
  endpoint: string, 
  data: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

// Helper to handle API calls with mock fallback
export async function apiCallWithMock<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  mockData: T
): Promise<T> {
  try {
    const response = await apiCall()
    return response.data
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    return mockData
  }
}
