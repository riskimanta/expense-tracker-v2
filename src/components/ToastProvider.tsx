"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '@/components/ui/toast'

interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: 'default' | 'destructive' | 'success'
  duration?: number
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void
  showToast: (message: Omit<ToastMessage, 'id'>) => void // Alias for backward compatibility
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      id,
      ...message,
      duration: message.duration || 5000
    }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto hide after duration
    setTimeout(() => {
      dismiss(id)
    }, newToast.duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toast, showToast: toast, dismiss, dismissAll }}>
      {children}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
