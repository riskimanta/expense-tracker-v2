"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

interface AdminTableProps<T> {
  data: T[]
  columns: {
    key: keyof T
    label: string
    sortable?: boolean
    render?: (value: string | number, item: T) => React.ReactNode
  }[]
  searchKeys?: (keyof T)[]  // Multiple search keys
  pageSize?: number
  emptyMessage?: string
  isLoading?: boolean
  searchPlaceholder?: string
  defaultSortKey?: keyof T
  defaultSortDirection?: 'asc' | 'desc'
}

// Helper function to get unique key for table rows
function getItemKey<T extends Record<string, unknown>>(item: T, index: number): string | number {
  if ('id' in item && item.id) return item.id as string | number
  if ('code' in item && item.code) return item.code as string | number
  return index
}

export function AdminTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKeys,
  pageSize = 10,
  emptyMessage = 'Tidak ada data',
  isLoading = false,
  searchPlaceholder = 'Cari...',
  defaultSortKey,
  defaultSortDirection = 'asc'
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey || null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchKeys || !searchTerm) return data
    
    return data.filter(item => {
      return searchKeys.some(key => {
        const value = item[key]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase())
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, searchKeys, searchTerm])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortKey, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-[var(--txt-med)]">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-[var(--txt-med)]">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Search - Only show if searchKeys is provided */}
      {searchKeys && searchKeys.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--txt-3)]" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-base pl-10 text-[color:var(--txt-1)] placeholder:text-[color:var(--txt-3)] focus:ring-[color:var(--primary)]"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`${
                    column.sortable ? 'cursor-pointer hover:text-[color:var(--txt-1)]' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={getItemKey(item, index)}
                className="transition-colors"
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="text-sm text-[color:var(--txt-1)]">
                    {column.render
                      ? column.render(item[column.key] as string | number, item)
                      : String(item[column.key] || '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[color:var(--txt-2)]">
            Menampilkan {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, sortedData.length)} dari {sortedData.length} data
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-ghost border-[color:var(--border)] hover:bg-[color:var(--surface-2)]"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-ghost border-[color:var(--border)] hover:bg-[var(--surface-2)]"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
