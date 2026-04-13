
import { useState } from "react"
import { PageLayout } from "../components/v0-layout/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/v0-ui/Card"
import { Button } from "../components/v0-ui/Button"
import { Input } from "../components/v0-ui/Input"
import { Badge } from "../components/v0-ui/Badge"
import {
  Database,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ChevronRight,
} from "lucide-react"
import { cn } from "../lib/utils"

const mockDataSources = [
  {
    id: "1",
    name: "Production PostgreSQL",
    type: "postgresql",
    host: "db.production.internal",
    status: "connected",
    lastConnected: "2分钟前",
    tables: 24,
  },
  {
    id: "2",
    name: "Analytics MySQL",
    type: "mysql",
    host: "analytics.mysql.internal",
    status: "connected",
    lastConnected: "1小时前",
    tables: 56,
  },
  {
    id: "3",
    name: "Dev MongoDB",
    type: "mongodb",
    host: "dev.mongodb.internal",
    status: "error",
    lastConnected: "1天前",
    tables: 0,
  },
]

const dbTypes = [
  { id: "postgresql", name: "PostgreSQL", icon: "🐘" },
  { id: "mysql", name: "MySQL", icon: "🐬" },
  { id: "mongodb", name: "MongoDB", icon: "🍃" },
]

interface V0Props {
  onNavigate?: (page: string) => void
}

export function V0DataSourcesPage({ onNavigate }: V0Props) {
  const [dataSources, setDataSources] = useState(mockDataSources)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSource, setNewSource] = useState({
    name: "",
    type: "postgresql",
    host: "",
    port: "5432",
    database: "",
    username: "",

  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="success">已连接</Badge>
      case "error":
        return <Badge variant="destructive">连接失败</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const handleAdd = () => {
    console.log("Add data source:", newSource)
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    setDataSources(dataSources.filter((ds) => ds.id !== id))
  }

  const handleTest = (id: string) => {
    console.log("Test connection:", id)
  }

  return (
    <PageLayout activeItem="datasources" onNavigate={onNavigate}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            数据源管理
          </h1>
          <p className="text-sm text-muted-foreground">
            管理和连接您的数据源
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          添加数据源
        </Button>
      </div>

      {/* Add New Data Source Form */}
      {showAddForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>添加新数据源</CardTitle>
            <CardDescription>填写数据库连接信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">名称</label>
                <Input
                  placeholder="My Database"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">类型</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                  value={newSource.type}
                  onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                >
                  {dbTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">主机地址</label>
                <Input
                  placeholder="localhost"
                  value={newSource.host}
                  onChange={(e) => setNewSource({ ...newSource, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">端口</label>
                <Input
                  placeholder="5432"
                  value={newSource.port}
                  onChange={(e) => setNewSource({ ...newSource, port: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">数据库名</label>
              <Input
                placeholder="my_database"
                value={newSource.database}
                onChange={(e) => setNewSource({ ...newSource, database: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>添加</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">已连接的数据源</h2>
        <div className="grid gap-4">
          {dataSources.map((dataSource) => (
            <Card key={dataSource.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{dataSource.name}</h3>
                        {getStatusBadge(dataSource.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {dataSource.host} · {dataSource.tables} 个表
                      </p>
                      <p className="text-xs text-muted-foreground">
                        上次连接: {dataSource.lastConnected}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleTest(dataSource.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("Edit data source:", dataSource.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(dataSource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
