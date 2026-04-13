
import { useState } from "react"
import { PageLayout } from "../components/v0-layout/PageLayout"
import { Card, CardContent } from "../components/v0-ui/Card"
import { Button } from "../components/v0-ui/Button"
import { Input } from "../components/v0-ui/Input"
import { Badge } from "../components/v0-ui/Badge"
import {
  Clock,
  Search,
  Trash2,
  RotateCcw,
  Filter,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { cn } from "../lib/utils"

const mockHistory = [
  {
    id: "1",
    query: "最近7天的日活用户趋势",
    sql: "SELECT DATE(activity_date), COUNT(DISTINCT user_id) FROM user_activities WHERE activity_date >= CURRENT_DATE - INTERVAL '7 days' GROUP BY DATE(activity_date)",
    timestamp: "2024-01-15 14:30:25",
    duration: "156ms",
    rows: 7,
    result: "success",
  },
  {
    id: "2",
    query: "用户留存率分析",
    sql: "SELECT cohort, COUNT(DISTINCT user_id) * 1.0 / COUNT(*) as retention_rate FROM user_retention WHERE retention_day = 7 GROUP BY cohort",
    timestamp: "2024-01-15 14:25:10",
    duration: "234ms",
    rows: 5,
    result: "success",
  },
  {
    id: "3",
    query: "各渠道转化率对比",
    sql: "SELECT channel, COUNT(DISTINCT user_id) as users, COUNT(DISTINCT CASE WHEN converted THEN user_id END) * 1.0 / COUNT(DISTINCT user_id) as conversion_rate FROM user_acquisition GROUP BY channel",
    timestamp: "2024-01-15 14:20:00",
    duration: "189ms",
    rows: 4,
    result: "success",
  },
  {
    id: "4",
    query: "本月新增用户按来源分布",
    sql: "SELECT source, COUNT(*) as new_users FROM users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) GROUP BY source",
    timestamp: "2024-01-15 14:15:30",
    duration: "145ms",
    rows: 6,
    result: "error",
  },
]

interface V0Props {
  onNavigate?: (page: string) => void
}

export function V0HistoryPage({ onNavigate }: V0Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const filteredHistory = mockHistory.filter((item) =>
    item.query.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredHistory.map((item) => item.id)))
    }
  }

  const handleReRun = (id: string) => {
    console.log("Re-run query:", id)
  }

  const handleDelete = (id: string) => {
    console.log("Delete query:", id)
  }

  const handleDeleteSelected = () => {
    console.log("Delete selected:", Array.from(selectedItems))
    setSelectedItems(new Set())
  }

  return (
    <PageLayout activeItem="history" onNavigate={onNavigate}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            查询历史
          </h1>
          <p className="text-sm text-muted-foreground">
            查看和重新执行历史查询
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索历史查询..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            筛选
          </Button>
          {selectedItems.size > 0 && (
            <Button variant="destructive" className="gap-2" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4" />
              删除已选 ({selectedItems.size})
            </Button>
          )}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {/* Select All */}
        <label className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.size === filteredHistory.length && filteredHistory.length > 0}
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm font-medium text-foreground">
            全选 ({filteredHistory.length} 条记录)
          </span>
        </label>

        {filteredHistory.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "transition-all hover:border-primary/30",
              selectedItems.has(item.id) && "border-primary bg-primary/5"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleSelect(item.id)}
                  className="mt-1 h-4 w-4 rounded border-border"
                />

                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {item.result === "success" ? (
                    <TrendingUp className="h-5 w-5 text-primary" />
                  ) : (
                    <BarChart3 className="h-5 w-5 text-destructive" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{item.query}</h3>
                      <code className="block text-xs text-muted-foreground truncate">
                        {item.sql}
                      </code>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{item.timestamp}</span>
                        <span>·</span>
                        <span>{item.duration}</span>
                        <span>·</span>
                        <span>{item.rows} 行</span>
                        {item.result === "success" ? (
                          <Badge variant="success">成功</Badge>
                        ) : (
                          <Badge variant="destructive">失败</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleReRun(item.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                        重新运行
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">暂无历史记录</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "没有找到匹配的查询" : "您的查询历史将显示在这里"}
          </p>
        </Card>
      )}
    </PageLayout>
  )
}
