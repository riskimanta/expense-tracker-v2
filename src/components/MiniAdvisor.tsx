import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface AdvisorData {
  message: string
  type: 'info' | 'warning' | 'success'
  action?: string
}

interface MiniAdvisorProps {
  data: AdvisorData
  className?: string
}

const getAdvisorIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-[var(--success)]" />
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-[var(--warning)]" />
    case 'info':
    default:
      return <Info className="h-5 w-5 text-[var(--primary)]" />
  }
}

const getAdvisorColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'border-[var(--success)] bg-[var(--success)] bg-opacity-10'
    case 'warning':
      return 'border-[var(--warning)] bg-[var(--warning)] bg-opacity-10'
    case 'info':
    default:
      return 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10'
  }
}

export function MiniAdvisor({ data, className }: MiniAdvisorProps) {
  return (
    <div className={`${className} p-4 rounded-lg border ${getAdvisorColor(data.type)}`}>
      <div className="flex items-start space-x-3">
        {getAdvisorIcon(data.type)}
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">Financial Advisor</h3>
          <p className="text-sm text-muted-foreground mb-3">{data.message}</p>
          {data.action && (
            <button className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline">
              {data.action} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
