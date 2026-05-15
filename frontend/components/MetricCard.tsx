interface MetricCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
    sub?: string
  }
  
  export function MetricCard({ label, value, icon, sub }: MetricCardProps) {
    return (
      <div className="rounded-lg bg-muted/50 p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          {icon}
          <span>{label}</span>
        </div>
        <p className="text-2xl font-medium">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    )
  }