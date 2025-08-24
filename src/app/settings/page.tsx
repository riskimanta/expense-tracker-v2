import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola preferensi akun dan pengaturan Anda
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pengaturan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fitur pengaturan dan preferensi segera hadir...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
