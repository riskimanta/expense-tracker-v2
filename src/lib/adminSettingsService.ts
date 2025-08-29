export interface AdminSettings {
  safeToSpendBuffer: number
  monthStartDate: number
  showDecimals: boolean
}

// Database-based admin settings service
export class AdminSettingsService {
  private static instance: AdminSettingsService
  private settings: AdminSettings = {
    safeToSpendBuffer: 20,
    monthStartDate: 1,
    showDecimals: true,
  }

  private constructor() {
    // Initialize with default settings
  }

  public static getInstance(): AdminSettingsService {
    if (!AdminSettingsService.instance) {
      AdminSettingsService.instance = new AdminSettingsService()
    }
    return AdminSettingsService.instance
  }

  async getSettings(): Promise<AdminSettings> {
    try {
      // TODO: Replace with actual database call
      // const response = await fetch('/api/admin/settings')
      // if (!response.ok) throw new Error('Failed to fetch settings')
      // return response.json()
      
      // For now, return in-memory data
      return this.settings
    } catch (error) {
      console.error('Error fetching admin settings:', error)
      return this.settings
    }
  }

  async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    try {
      const updatedSettings = { ...this.settings, ...updates }
      
      // TODO: Replace with actual database call
      // const response = await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedSettings)
      // })
      // if (!response.ok) throw new Error('Failed to update settings')
      // return response.json()
      
      this.settings = updatedSettings
      return updatedSettings
    } catch (error) {
      console.error('Error updating admin settings:', error)
      throw error
    }
  }

  async resetSettings(): Promise<AdminSettings> {
    try {
      const defaultSettings: AdminSettings = {
        safeToSpendBuffer: 20,
        monthStartDate: 1,
        showDecimals: true,
      }
      
      // TODO: Replace with actual database call
      // const response = await fetch('/api/admin/settings/reset', { method: 'POST' })
      // if (!response.ok) throw new Error('Failed to reset settings')
      // return response.json()
      
      this.settings = defaultSettings
      return defaultSettings
    } catch (error) {
      console.error('Error resetting admin settings:', error)
      throw error
    }
  }

  async exportSettings(): Promise<string> {
    try {
      const settings = await this.getSettings()
      return JSON.stringify(settings, null, 2)
    } catch (error) {
      console.error('Error exporting settings:', error)
      throw error
    }
  }

  async importSettings(settingsJson: string): Promise<AdminSettings> {
    try {
      const importedSettings = JSON.parse(settingsJson)
      
      // Validate imported settings
      if (importedSettings.safeToSpendBuffer !== undefined &&
          importedSettings.monthStartDate !== undefined &&
          importedSettings.showDecimals !== undefined) {
        
        return await this.updateSettings(importedSettings)
      } else {
        throw new Error('Invalid settings format')
      }
    } catch (error) {
      console.error('Error importing settings:', error)
      throw error
    }
  }
}

export const adminSettingsService = AdminSettingsService.getInstance()
