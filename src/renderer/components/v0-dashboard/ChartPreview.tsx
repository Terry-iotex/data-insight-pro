"use client"

import { Card } from "../v0-ui/Card"
import { BarChart3, TrendingUp } from "lucide-react"

export function ChartPreview() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="font-semibold text-foreground">数据趋势</h3>
          <p className="text-sm text-muted-foreground">最近30天的数据变化</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex h-64 items-center justify-center rounded-xl bg-muted/20">
          <div className="text-center">
            <TrendingUp className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">图表将在此处显示</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
