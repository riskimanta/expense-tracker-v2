"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { formatIDR } from '@/lib/format'
import { useToast } from '@/components/ToastProvider'
import { 
  mockWishlistItems, 
  mockWishlistCategories,
  getPriorityColor,
  getStatusColor,
  getProgressPercentage,
  type WishlistItem
} from '@/mock/wishlist'
import { Heart, Plus, Target, Calendar, DollarSign, BookOpen, Trash2, Edit } from 'lucide-react'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlistItems)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    estimatedPrice: '',
    priority: 'medium' as const,
    targetDate: '',
    category: '',
    notes: ''
  })
  const [advisorPrice, setAdvisorPrice] = useState('')
  const { showToast } = useToast()

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newItem.name || !newItem.estimatedPrice || !newItem.targetDate || !newItem.category) {
      showToast({
        title: 'Error',
        description: 'Semua field wajib diisi',
        variant: 'destructive'
      })
      return
    }

    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      estimatedPrice: parseInt(newItem.estimatedPrice),
      priority: newItem.priority,
      targetDate: newItem.targetDate,
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
      estimatedPrice: '',
      priority: 'medium',
      targetDate: '',
      category: '',
      notes: ''
    })
    setIsAddModalOpen(false)
  }

  const handleAddFromAdvisor = () => {
    if (!advisorPrice) {
      showToast({
        title: 'Error',
        description: 'Masukkan harga item',
        variant: 'destructive'
      })
      return
    }

    const price = parseInt(advisorPrice)
    
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

    setAdvisorPrice('')
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
                <Input
                  type="text"
                  placeholder="1000000"
                  value={advisorPrice}
                  onChange={(e) => setAdvisorPrice(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-[var(--txt-low)] mt-1">
                  Contoh: 1000000 = Rp 1.000.000
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
                  <Input
                    type="text"
                    placeholder="1000000"
                    value={newItem.estimatedPrice}
                    onChange={(e) => setNewItem({...newItem, estimatedPrice: e.target.value})}
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
                  <Input
                    type="date"
                    value={newItem.targetDate}
                    onChange={(e) => setNewItem({...newItem, targetDate: e.target.value})}
                    className="h-11"
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
