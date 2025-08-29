"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { formatIDR } from '@/lib/currency'
import { useToast } from '@/components/ToastProvider'
import { CurrencyInput } from '@/components/ui/currency-input'
// Mock data moved inline
interface WishlistItem {
  id: string
  name: string
  estimatedPrice: number
  priority: 'low' | 'medium' | 'high'
  targetDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'achieved' | 'saving'
  notes: string
  category: string
  currentSavings: number
  createdAt: string
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    estimatedPrice: 25000000,
    priority: 'high',
    targetDate: '2024-06-01',
    status: 'pending',
    notes: 'iPhone terbaru dengan kamera yang bagus',
    category: 'Electronics',
    currentSavings: 5000000,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Liburan ke Bali',
    estimatedPrice: 8000000,
    priority: 'medium',
    targetDate: '2024-08-01',
    status: 'in-progress',
    notes: 'Liburan 5 hari 4 malam dengan keluarga',
    category: 'Travel',
    currentSavings: 3000000,
    createdAt: '2024-01-01'
  }
]

const mockWishlistCategories = [
  'Electronics', 'Travel', 'Fashion', 'Home', 'Sports', 'Books', 'Other'
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'in-progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'achieved': return 'bg-green-100 text-green-800'
    case 'saving': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getProgressPercentage = (current: number, target: number) => {
  return Math.min((current / target) * 100, 100)
}
import { Heart, Plus, Target, Calendar, DollarSign, BookOpen, Trash2, Edit } from 'lucide-react'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlistItems)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    estimatedPriceNumber: 0,
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetDate: new Date(),
    category: '',
    notes: ''
  })
  const [advisorPriceNumber, setAdvisorPriceNumber] = useState<number>(0)
  const { showToast } = useToast()

  // Function untuk format angka ke format ribuan Indonesia
  const formatToIndonesianNumber = (num: number): string => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  // Function untuk parse string format Indonesia ke number
  const parseIndonesianNumber = (str: string): number => {
    return parseInt(str.replace(/\D/g, '')) || 0
  }

  // Handle input change untuk advisor price dengan format otomatis
  const handleAdvisorPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleanValue = inputValue.replace(/\D/g, '') // Hapus semua non-digit
    
    if (cleanValue === '') {
          setAdvisorPriceNumber(0)
      return
    }
    
    const numValue = parseInt(cleanValue)
    setAdvisorPriceNumber(numValue)
    
    // Format ke format ribuan Indonesia
    const formattedValue = formatToIndonesianNumber(numValue)

  }

  // Handle input change untuk estimated price dengan format otomatis
  const handleEstimatedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const cleanValue = inputValue.replace(/\D/g, '') // Hapus semua non-digit
    
    if (cleanValue === '') {
      setNewItem({...newItem, estimatedPriceNumber: 0})
      return
    }
    
    const numValue = parseInt(cleanValue)
    
    // Format ke format ribuan Indonesia
    const formattedValue = formatToIndonesianNumber(numValue)
          setNewItem({...newItem, estimatedPriceNumber: numValue})
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newItem.name || newItem.estimatedPriceNumber <= 0 || !newItem.targetDate || !newItem.category) {
      showToast({
        title: 'Error',
        description: 'Semua field wajib diisi dan harga harus lebih dari 0',
        variant: 'destructive'
      })
      return
    }

    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      estimatedPrice: newItem.estimatedPriceNumber,
      priority: newItem.priority,
      targetDate: newItem.targetDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD format
      status: 'pending',
      notes: newItem.notes,
      category: newItem.category,
      currentSavings: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setItems([...items, item])
    
    showToast({
      title: 'Sukses!',
      description: 'Item wishlist berhasil ditambahkan',
      variant: 'success'
    })

    // Reset form and close modal
    setNewItem({
      name: '',
      estimatedPriceNumber: 0,
      priority: 'medium',
      targetDate: new Date(),
      category: '',
      notes: ''
    })
    setIsAddModalOpen(false)
  }

  const handleAddFromAdvisor = () => {
    if (advisorPriceNumber <= 0) {
      showToast({
        title: 'Error',
        description: 'Masukkan harga item',
        variant: 'destructive'
      })
      return
    }

    const price = advisorPriceNumber
    
    // Simulate advisor check
    const canAfford = price <= 5000000 // Mock threshold
    const status = canAfford ? 'pending' : 'pending'
    const priority = price > 10000000 ? 'high' : price > 5000000 ? 'medium' : 'low'

    const item: WishlistItem = {
      id: Date.now().toString(),
      name: `Item dari Advisor (Rp ${formatIDR(price)})`,
      estimatedPrice: price,
      priority,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status,
      notes: `Ditambahkan dari Advisor. ${canAfford ? 'Bisa dibeli sekarang' : 'Perlu menabung dulu'}`,
      category: 'Other',
      currentSavings: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setItems([...items, item])
    
    showToast({
      title: 'Sukses!',
      description: 'Item berhasil ditambahkan dari Advisor',
      variant: 'success'
    })

    setAdvisorPriceNumber(0)
    setIsAdvisorModalOpen(false)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    showToast({
      title: 'Sukses!',
      description: 'Item berhasil dihapus',
      variant: 'success'
    })
  }

  const totalWorth = items.reduce((sum, item) => sum + item.estimatedPrice, 0)
  const totalSavings = items.reduce((sum, item) => sum + item.currentSavings, 0)
  const achievedItems = items.filter(item => item.status === 'achieved').length

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Wishlist</h1>
        <p className="mt-1 text-muted-foreground">Kelola impian dan target keuangan Anda</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Nilai</p>
            <p className="text-2xl font-semibold text-[var(--warning)]">
              {formatIDR(totalWorth)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Tabungan</p>
            <p className="text-2xl font-semibold text-[var(--success)]">
              {formatIDR(totalSavings)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tercapai</p>
            <p className="text-2xl font-semibold text-[var(--primary)]">
              {achievedItems} / {items.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Dialog open={isAdvisorModalOpen} onOpenChange={setIsAdvisorModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-11 px-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Tambahkan dari Advisor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambahkan dari Advisor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Harga Item</label>
                <CurrencyInput
                  value={advisorPriceNumber}
                  onValueChange={(value) => setAdvisorPriceNumber(value || 0)}
                  placeholder="1.000.000"
                  className="h-11"
                />
                <p className="text-xs text-[var(--txt-low)] mt-1">
                  Contoh: 1000000 = Rp 1.000.000 (format otomatis)
                </p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAdvisorModalOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button onClick={handleAddFromAdvisor} className="flex-1">
                  Tambahkan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />
              + Tambah Wishlist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Wishlist Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Item</label>
                <Input
                  placeholder="Contoh: iPhone 15 Pro"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="h-11"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Harga Estimasi</label>
                  <CurrencyInput
                    value={newItem.estimatedPriceNumber}
                    onValueChange={(value) => setNewItem({...newItem, estimatedPriceNumber: value || 0})}
                    placeholder="1.000.000"
                    className="h-11"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Prioritas</label>
                  <Select value={newItem.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewItem({...newItem, priority: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Target Tanggal</label>
                  <DateInput
                    value={newItem.targetDate}
                    onChange={(date) => setNewItem({...newItem, targetDate: date || new Date()})}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Kategori</label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWishlistCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Catatan (Opsional)</label>
                <Textarea
                  placeholder="Tambahkan catatan atau alasan..."
                  value={newItem.notes}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Tambahkan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const progress = getProgressPercentage(item.currentSavings, item.estimatedPrice)
          const remaining = item.estimatedPrice - item.currentSavings
          
          return (
            <Card key={item.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-[var(--primary)]" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority === 'high' ? 'Tinggi' : item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(item.status)}`}
                        >
                          {item.status === 'achieved' ? 'Tercapai' : item.status === 'saving' ? 'Menabung' : 'Pending'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Harga</p>
                        <p className="font-medium text-foreground">{formatIDR(item.estimatedPrice)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="font-medium text-foreground">{item.targetDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dibuat</p>
                        <p className="font-medium text-foreground">{item.createdAt}</p>
                      </div>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress Tabungan</span>
                      <span className="text-foreground">
                        {formatIDR(item.currentSavings)} / {formatIDR(item.estimatedPrice)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {progress.toFixed(1)}% tercapai
                      </span>
                      <span className="text-muted-foreground">
                        Sisa: {formatIDR(remaining)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-[var(--danger)] hover:text-[var(--danger)]"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="rounded-xl border border-border bg-card p-12">
          <div className="text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum ada wishlist
            </h3>
            <p className="text-muted-foreground mb-4">
              Mulai dengan menambahkan impian pertama Anda
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              + Tambah Wishlist Pertama
            </Button>
          </div>
        </Card>
      )}
    </main>
  )
}
