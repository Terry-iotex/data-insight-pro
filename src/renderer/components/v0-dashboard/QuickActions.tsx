"use client"

import { Zap, FileText, BarChart3, Sparkles } from "lucide-react"
import { cn } from "../../lib/utils"

const actions = [
  { icon: Sparkles, label: "AI 分析", description: "智能分析数据趋势", color: "text-accent" },
  { icon: BarChart3, label: "可视化", description: "创建数据图表", color: "text-chart-1" },
  { icon: FileText, label: "报告", description: "生成分析报告", color: "text-chart-2" },
  { icon: Zap, label: "快捷查询", description: "常用查询模板", color: "text-chart-3" },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <button
          key={action.label}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <action.icon className={cn("h-5 w-5", action.color)} />
          </div>
          <div>
            <p className="font-medium text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
