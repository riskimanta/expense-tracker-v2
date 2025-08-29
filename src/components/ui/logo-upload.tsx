"use client"

import { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface LogoUploadProps {
  value?: string
  onChange: (logoUrl: string) => void
  onRemove?: () => void
  className?: string
}

export function LogoUpload({ value, onChange, onRemove, className = "" }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload gagal')
      }

      const data = await response.json()
      
      if (data.success) {
        setPreview(data.logoUrl)
        onChange(data.logoUrl)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Gagal upload logo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (onRemove) onRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Logo'}
        </Button>
        
        {preview && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            Hapus
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview && (
        <div className="relative w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={preview}
            alt="Logo preview"
            fill
            className="object-contain"
          />
        </div>
      )}

      {!preview && (
        <div className="w-32 h-20 border-2 border-dashed border-[color:var(--border)] rounded-lg flex items-center justify-center bg-[color:var(--surface-2)]">
          <ImageIcon className="w-8 h-8 text-[color:var(--txt-3)]" />
        </div>
      )}

      <p className="text-sm text-[color:var(--txt-2)]">
        Format: JPG, PNG, GIF. Maksimal 5MB
      </p>
    </div>
  )
}
