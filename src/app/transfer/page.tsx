import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transfer</h1>
        <p className="text-muted-foreground">
          Transfer money between accounts
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transfer Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Transfer features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
