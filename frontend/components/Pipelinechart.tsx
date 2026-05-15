"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { TPipelineStage } from "@/types/types"

const COLORS = ["#378ADD", "#1D9E75", "#BA7517", "#D4537E", "#534AB7", "#D85A30"]

interface PipelineChartProps {
  data: TPipelineStage[]
}

export function PipelineChart({ data }: PipelineChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Pipeline
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 24 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="stage"
            width={80}
            tick={{ fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload as TPipelineStage
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
                  <p className="font-medium">{d.stage}</p>
                  <p className="text-muted-foreground">
                    {d.count} applications ({d.percentage}%)
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.map((col, i) => (
          <div key={col.stage} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-muted-foreground">{col.stage}</span>
            <span className="font-medium">{col.count}</span>
            <span className="w-10 text-right text-muted-foreground">{col.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}