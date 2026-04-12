"use client"

import { useState } from "react"
import { PageLayout } from "../components/v0-layout/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/v0-ui/Card"
import { Button } from "../components/v0-ui/Button"
import { EmptyStates } from "../components/v0-dashboard/EmptyStates"
import {
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  TrendingUp,
  Plus,
  Download,
  Share2,
  Filter,
} from "lucide-react"
import { cn } from "../lib/utils"

const chartTemplates = [
  { icon: LineChart, title: "折线图", description: "展示趋势变化" },
  { icon: BarChart3, title: "柱状图", description: "对比数据差异" },
  { icon: PieChartIcon, title: "饼图", description: "展示占比分布" },
  { icon: TrendingUp, title: "面积图", description: "强调累计趋势" },
]

const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  tertiary: "#06b6d4",
  quaternary: "#10b981",
  accent: "#f59e0b",
}

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"]

const chartData = [
  { name: "1月", value: 4000, prev: 3200 },
  { name: "2月", value: 3000, prev: 2800 },
  { name: "3月", value: 5000, prev: 4100 },
  { name: "4月", value: 4500, prev: 3900 },
  { name: "5月", value: 6000, prev: 4800 },
  { name: "6月", value: 5500, prev: 5200 },
]

const barData = [
  { name: "直接访问", value: 4200 },
  { name: "搜索引擎", value: 3800 },
  { name: "社交媒体", value: 2900 },
  { name: "邮件营销", value: 2100 },
  { name: "联盟推广", value: 1800 },
]

const pieData = [
  { name: "移动端", value: 45 },
  { name: "桌面端", value: 35 },
  { name: "平板", value: 15 },
  { name: "其他", value: 5 },
]

interface V0Props {
  onNavigate?: (page: string) => void
}

export function V0ChartsPage({ onNavigate }: V0Props) {
  const [hasData] = useState(true)

  if (!hasData) {
    return (
      <PageLayout activeItem="charts" onNavigate={onNavigate}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              数据可视化
            </h1>
            <p className="text-sm text-muted-foreground">
              创建和管理你的数据图表
            </p>
          </div>
        </div>
        <EmptyStates type="no-charts" />
      </PageLayout>
    )
  }

  return (
    <PageLayout activeItem="charts" onNavigate={onNavigate}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            数据可视化
          </h1>
          <p className="text-sm text-muted-foreground">
            创建和管理你的数据图表
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新建图表
          </Button>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {chartTemplates.map((template, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <template.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{template.title}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Area Chart Placeholder */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">用户增长趋势</CardTitle>
              <CardDescription>月度活跃用户对比</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-xl bg-muted/20">
              <div className="text-center">
                <LineChart className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">图表将在此处显示</p>
                <p className="text-xs text-muted-foreground/60 mt-1">需要 Recharts 集成</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart Placeholder */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">流量来源</CardTitle>
              <CardDescription>各渠道访问量分布</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-xl bg-muted/20">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">图表将在此处显示</p>
                <p className="text-xs text-muted-foreground/60 mt-1">需要 Recharts 集成</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart Placeholder */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">设备分布</CardTitle>
              <CardDescription>用户访问设备占比</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-center justify-center rounded-xl bg-muted/20">
              <div className="text-center">
                <PieChartIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">图表将在此处显示</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">数据概览</CardTitle>
            <CardDescription>关键指标汇总</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "24.5K", label: "总访问量", change: "+12.3%", positive: true },
                { value: "8.2K", label: "独立用户", change: "+8.1%", positive: true },
                { value: "3.2%", label: "转化率", change: "+0.5%", positive: true },
                { value: "4m 32s", label: "平均时长", change: "-0.8%", positive: false },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-secondary/50 p-4 transition-all hover:bg-secondary"
                >
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 transition-all group-hover:scale-150" />
                  <div className="relative">
                    <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                    <div className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      stat.positive
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
