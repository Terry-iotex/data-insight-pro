"use client"

import { Clock, TrendingUp } from "lucide-react"
import { cn } from "../../lib/utils"

const recentQueries = [
  {
    query: "最近7天的日活用户趋势",
    time: "2分钟前",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    query: "用户留存率分析",
    time: "15分钟前",
    icon: TrendingUp,
    color: "text-chart-2",
  },
  {
    query: "各渠道转化率对比",
    time: "1小时前",
    icon: TrendingUp,
    color: "text-chart-3",
  },
]

export function RecentQueries() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">最近查询</h2>
            <p className="text-sm text-muted-foreground">快速查看历史记录</p>
          </div>
        </div>
        <button className="text-sm text-primary hover:underline">
          查看全部
        </button>
      </div>

      {/* Queries List */}
      <div className="space-y-2">
        {recentQueries.map((item, index) => (
          <button
            key={index}
            className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-muted/20"
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color === "text-emerald-500" ? "bg-emerald-500/10" : item.color === "text-chart-2" ? "bg-chart-2/10" : "bg-chart-3/10")}>
              <item.icon className={cn("h-5 w-5", item.color)} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.query}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
