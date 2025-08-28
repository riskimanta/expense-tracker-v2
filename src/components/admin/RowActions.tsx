"use client"

import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface RowActionsProps {
  onEdit: () => void
  onDelete: () => void
  editLabel?: string
  deleteLabel?: string
  disableDelete?: boolean
}

export function RowActions({ 
  onEdit, 
  onDelete, 
  editLabel = 'Edit', 
  deleteLabel = 'Hapus',
  disableDelete = false
}: RowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="h-8 w-8 p-0 border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)] hover:text-[var(--txt-high)]"
        title={editLabel}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {!disableDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 border-[var(--border)] text-[var(--danger)] hover:bg-[var(--surface)] hover:text-[var(--danger)]"
          title={deleteLabel}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
