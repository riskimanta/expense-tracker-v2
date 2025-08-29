"use client"

import { useState, useEffect } from "react"
import { Save, Download, Upload, Settings as SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { adminSettingsService } from "@/lib/adminSettingsService"
import { AdminSettings } from "@/types/admin"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    safeToSpendBuffer: 20,
    monthStartDate: 1,
    showDecimals: true,
  })
  const [isDirty, setIsDirty] = useState(false)
  const { toast } = useToast()

  // Load settings from database service on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await adminSettingsService.getSettings()
        setSettings(savedSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
        toast({
          title: "Error",
          description: "Gagal memuat pengaturan",
          variant: "destructive",
        })
      }
    }
    loadSettings()
  }, [toast])

  const handleSettingChange = (key: keyof AdminSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    try {
      await adminSettingsService.updateSettings(settings)
      setIsDirty(false)
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil disimpan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "admin-settings.json"
    link.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Berhasil",
      description: "Pengaturan berhasil diexport",
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedSettings = JSON.parse(content)
        
        // Validate imported settings
        if (importedSettings.safeToSpendBuffer !== undefined &&
            importedSettings.monthStartDate !== undefined &&
            importedSettings.showDecimals !== undefined) {
          
          setSettings(importedSettings)
          setIsDirty(true)
          toast({
            title: "Berhasil",
            description: "Pengaturan berhasil diimport",
          })
        } else {
          throw new Error("Invalid settings format")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "File tidak valid atau rusak",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    
    // Reset input
    event.target.value = ""
  }

  const exportMockData = () => {
    const mockData = {
      users: [
        { id: "1", name: "User Demo", email: "demo@example.com", role: "user", status: "active", createdAt: "2024-01-01T00:00:00Z" },
        { id: "2", name: "Admin Demo", email: "admin@example.com", role: "admin", status: "active", createdAt: "2024-01-01T00:00:00Z" }
      ],
      categories: [
        { id: "1", name: "Makanan", type: "expense", color: "#ef4444", icon: "🍽️", isDefault: true },
        { id: "2", name: "Transport", type: "expense", color: "#3b82f6", icon: "🚗", isDefault: true },
        { id: "3", name: "Gaji", type: "income", color: "#10b981", icon: "💰", isDefault: true }
      ],
      accounts: [
        { id: "1", name: "Cash", type: "cash", balance: 500000 },
        { id: "2", name: "Bank BCA", type: "bank", balance: 2500000 },
        { id: "3", name: "E-Wallet", type: "wallet", balance: 750000 }
      ],
      currencies: [
        { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rateToIDR: 1, updatedAt: "2024-01-01T00:00:00Z" },
        { code: "USD", name: "US Dollar", symbol: "$", rateToIDR: 15000, updatedAt: "2024-01-01T00:00:00Z" },
        { code: "EUR", name: "Euro", symbol: "€", rateToIDR: 16500, updatedAt: "2024-01-01T00:00:00Z" }
      ]
    }

    const dataStr = JSON.stringify(mockData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "mock-data.json"
    link.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Berhasil",
      description: "Mock data berhasil diexport",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--txt-high)]">Pengaturan Sistem</h1>
          <p className="text-[var(--txt-med)]">Konfigurasi sistem dan pengaturan global</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportMockData} variant="outline" className="border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)]">
            <Download className="w-4 h-4 mr-2" />
            Export Mock Data
          </Button>
          <Button onClick={handleSave} disabled={!isDirty} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--txt-high)] flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Pengaturan Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
                Safe-to-Spend Buffer (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.safeToSpendBuffer}
                onChange={(e) => handleSettingChange("safeToSpendBuffer", parseInt(e.target.value) || 0)}
                className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
              />
              <p className="text-xs text-[var(--txt-low)] mt-1">
                Persentase buffer untuk pengeluaran aman
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
                Tanggal Mulai Bulan
              </label>
              <Input
                type="number"
                min="1"
                max="31"
                value={settings.monthStartDate}
                onChange={(e) => handleSettingChange("monthStartDate", parseInt(e.target.value) || 1)}
                className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
              />
              <p className="text-xs text-[var(--txt-low)] mt-1">
                Tanggal untuk reset budget bulanan (1-31)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-[var(--txt-med)]">
                  Tampilkan Desimal
                </label>
                <p className="text-xs text-[var(--txt-low)]">
                  Tampilkan angka desimal di UI
                </p>
              </div>
              <Switch
                checked={settings.showDecimals}
                onCheckedChange={(checked) => handleSettingChange("showDecimals", checked)}
                className="data-[state=checked]:bg-[var(--primary)]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--txt-high)]">Import/Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
                Export Pengaturan
              </label>
              <Button onClick={handleExport} variant="outline" className="w-full border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)]">
                <Download className="w-4 h-4 mr-2" />
                Export ke JSON
              </Button>
              <p className="text-xs text-[var(--txt-low)] mt-1">
                Simpan pengaturan ke file JSON
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
                Import Pengaturan
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)]">
                  <Upload className="w-4 h-4 mr-2" />
                  Import dari JSON
                </Button>
              </div>
              <p className="text-xs text-[var(--txt-low)] mt-1">
                Muat pengaturan dari file JSON
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--txt-high)]">Informasi Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[var(--txt-low)]">Environment:</span>
              <span className="ml-2 text-[var(--txt-high)] font-mono">
                {process.env.NODE_ENV || "development"}
              </span>
            </div>
            <div>
              <span className="text-[var(--txt-low)]">Admin Access:</span>
              <span className="ml-2 text-[var(--txt-high)] font-mono">
                {process.env.NEXT_PUBLIC_SHOW_ADMIN === "1" ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div>
              <span className="text-[var(--txt-low)]">API URL:</span>
              <span className="ml-2 text-[var(--txt-high)] font-mono">
                {process.env.NEXT_PUBLIC_API_URL || "Mock Mode"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
