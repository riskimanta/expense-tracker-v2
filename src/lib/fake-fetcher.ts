// Simulate API delay and potential errors
export const fakeFetcher = async <T>(
  data: T,
  options?: {
    delay?: number
    shouldError?: boolean
    errorMessage?: string
  }
): Promise<T> => {
  const { delay = 1000, shouldError = false, errorMessage = "Something went wrong" } = options || {}

  await new Promise((resolve) => setTimeout(resolve, delay))

  if (shouldError) {
    throw new Error(errorMessage)
  }

  return data
}

// Simulate different loading states
export const simulateLoading = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Simulate network error
export const simulateError = (message: string) => 
  fakeFetcher(null, { shouldError: true, errorMessage: message })

