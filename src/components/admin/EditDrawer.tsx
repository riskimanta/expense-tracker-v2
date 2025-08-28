"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface EditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  onSave: () => void
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  loading?: boolean
}

export function EditDrawer({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  onCancel,
  saveText = 'Simpan',
  cancelText = 'Batal',
  loading = false
}: EditDrawerProps) {
  if (!open) return null

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-foreground">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 hover:bg-[var(--surface)]"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="border-border text-foreground hover:bg-[var(--surface)]"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
            >
              {loading ? 'Menyimpan...' : saveText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
