"use client"

import { Button } from "../v0-ui/Button"
import { Database, Sparkles, FileText, Clock } from "lucide-react"
import { cn } from "../../lib/utils"

interface EmptyStateProps {
  type: "no-datasource" | "no-insights" | "no-charts" | "no-history"
}

const emptyStates = {
  "no-datasource": {
    icon: Database,
    title: "连接数据源",
    description: "添加您的第一个数据源，开始 AI 数据分析之旅",
    action: "添加数据源",
    gradient: "from-blue-500 to-cyan-500",
  },
  "no-insights": {
    icon: Sparkles,
    title: "暂无洞察",
    description: "完成首次查询后，AI 将自动生成数据洞察",
    action: "开始查询",
    gradient: "from-primary to-accent",
  },
  "no-charts": {
    icon: FileText,
    title: "暂无图表",
    description: "创建您的第一个数据可视化图表",
    action: "创建图表",
    gradient: "from-chart-1 to-chart-2",
  },
  "no-history": {
    icon: Clock,
    title: "暂无历史记录",
    description: "您的查询历史将显示在这里",
    action: null,
    gradient: "from-muted-foreground to-muted",
  },
}

export function EmptyStates({ type }: EmptyStateProps) {
  const state = emptyStates[type]

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
      {/* Icon */}
      <div className={cn(
        "mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
        state.gradient
      )}>
        <state.icon className="h-10 w-10 text-white" />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-xl font-semibold text-foreground">
        {state.title}
      </h3>
      <p className="mb-6 max-w-sm text-muted-foreground">
        {state.description}
      </p>

      {/* Action Button */}
      {state.action && (
        <Button className="gap-2">
          {state.action}
        </Button>
      )}
    </div>
  )
}
