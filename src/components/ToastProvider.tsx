"use client"

import React, { createContext, useContext, useState } from 'react'
import { Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'

interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
}

interface ToastContextType {
  showToast: (message: Omit<ToastMessage, 'id'>) => void
  hideToast: (id: string) => void
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

  const showToast = (message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      id,
      ...message,
      duration: message.duration || 5000
    }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto hide after duration
    setTimeout(() => {
      hideToast(id)
    }, newToast.duration)
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="flex-1">
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            <ToastClose onClick={() => hideToast(toast.id)} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
