"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'danger' | 'warning'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  onConfirm,
  variant = 'danger'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[color:var(--surface)] border-[color:var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-[color:var(--txt-1)]">{title}</DialogTitle>
          <DialogDescription className="text-[color:var(--txt-2)]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[color:var(--border)] text-[color:var(--txt-1)] hover:bg-[color:var(--surface-2)]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`${
              variant === 'danger'
                ? 'bg-[color:var(--danger)] hover:bg-[color:var(--danger)]/90'
                : 'bg-[color:var(--brand)] hover:bg-[color:var(--brand-600)]'
            } text-white`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
