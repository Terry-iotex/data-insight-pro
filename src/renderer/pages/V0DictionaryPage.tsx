
import { useState } from "react"
import { PageLayout } from "../components/v0-layout/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/v0-ui/Card"
import { Button } from "../components/v0-ui/Button"
import { Input } from "../components/v0-ui/Input"
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Hash,
} from "lucide-react"
import { cn } from "../lib/utils"
import { showToast } from "../lib/download"

const mockMetrics = [
  {
    id: "1",
    name: "DAU",
    description: "日活跃用户数",
    formula: "COUNT(DISTINCT user_id) WHERE activity_date = CURRENT_DATE",
    category: "用户指标",
  },
  {
    id: "2",
    name: "留存率",
    description: "用户留存比例",
    formula: "用户在N天后仍活跃的比例",
    category: "用户指标",
  },
  {
    id: "3",
    name: "GMV",
    description: "商品交易总额",
    formula: "SUM(order_amount) WHERE order_status = 'completed'",
    category: "业务指标",
  },
]

const mockFields = [
  {
    table: "users",
    column: "user_id",
    description: "用户唯一标识",
    type: "INTEGER",
  },
  {
    table: "users",
    column: "created_at",
    description: "用户注册时间",
    type: "TIMESTAMP",
  },
  {
    table: "orders",
    column: "order_amount",
    description: "订单金额",
    type: "DECIMAL(10,2)",
  },
]

interface V0Props {
  onNavigate?: (page: string) => void
}

export function V0DictionaryPage({ onNavigate }: V0Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("metrics")

  const [showAddMetric, setShowAddMetric] = useState(false)

  const filteredMetrics = mockMetrics.filter((metric) =>
    metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    metric.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFields = mockFields.filter((field) =>
    field.column.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditMetric = (id: string) => {
    console.log("Edit metric:", id)
    showToast("编辑指标功能即将推出", "info")
  }

  const handleDeleteMetric = (id: string) => {
    console.log("Delete metric:", id)
    showToast("指标已删除", "success")
  }

  const handleEditField = (index: number) => {
    console.log("Edit field:", index)
    showToast("编辑字段功能即将推出", "info")
  }

  return (
    <PageLayout activeItem="dictionary" onNavigate={onNavigate}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            数据字典
          </h1>
          <p className="text-sm text-muted-foreground">
            管理业务指标和字段定义
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddMetric(true)
            showToast("添加指标对话框", "info")
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          添加指标
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索指标或字段..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("metrics")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "metrics"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Hash className="h-4 w-4" />
          业务指标
        </button>
        <button
          onClick={() => setActiveTab("fields")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "fields"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Tag className="h-4 w-4" />
          字段定义
        </button>
      </div>

      {/* Metrics Tab */}
      {activeTab === "metrics" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {filteredMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {metric.name}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {metric.category}
                        </span>
                      </CardTitle>
                      <CardDescription>{metric.description}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditMetric(metric.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteMetric(metric.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">计算公式</p>
                    <code className="text-sm text-foreground">{metric.formula}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Fields Tab */}
      {activeTab === "fields" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      表名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      字段名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      类型
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      描述
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFields.map((field, index) => (
                    <tr key={index} className="transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {field.table}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {field.column}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs rounded bg-muted px-2 py-1 text-muted-foreground">
                          {field.type}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {field.description}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditField(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
