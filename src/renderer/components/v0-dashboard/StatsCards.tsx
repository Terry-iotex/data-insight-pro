
import { Activity, Hash, Clock, Table } from "lucide-react"
import { formatNumber } from '../../utils/format'

interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  rowCount: number
  duration: number
  sql: string
  confidence?: {
    overall: number
    level: 'high' | 'medium' | 'low'
    breakdown?: Record<string, number>
    explain?: string[]
  } | null
}

interface StatsCardsProps {
  result: QueryResult
}

const CONFIDENCE_COLORS: Record<string, string> = {
  high: 'text-green-500',
  medium: 'text-amber-500',
  low: 'text-red-500',
}

const CONFIDENCE_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

function ConfidenceBadge({ confidence }: { confidence: NonNullable<QueryResult['confidence']> }) {
  const level = confidence.level || 'medium'
  const score = confidence.overall || 0

  return (
    <div className="flex items-center gap-1.5">
      <div className={`text-sm font-semibold ${CONFIDENCE_COLORS[level] || 'text-muted-foreground'}`}>
        {Math.round(score)}%
      </div>
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
        level === 'high' ? 'bg-green-500/15 text-green-600 dark:text-green-400' :
        level === 'medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
        'bg-red-500/15 text-red-600 dark:text-red-400'
      }`}>
        {CONFIDENCE_LABELS[level]}可信度
      </span>
    </div>
  )
}

export function StatsCards({ result }: StatsCardsProps) {
  const { columns, rows, rowCount, duration } = result

  // 找第一个真正有意义的数字列（排除 id 列和 name 列）
  const numericCols = columns.filter((col) => {
    const colLower = col.toLowerCase()
    if (colLower === 'name' || colLower === 'id') return false
    const sample = rows[0]?.[col]
    return typeof sample === "number" || (!isNaN(Number(sample)) && sample !== null && sample !== "")
  })

  const firstNumCol = numericCols[0]
  const sum = firstNumCol
    ? rows.reduce((acc, row) => acc + (Number(row[firstNumCol]) || 0), 0)
    : null

  const stats = [
    {
      label: "返回行数",
      value: formatNumber(rowCount),
      icon: Hash,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "字段数量",
      value: columns.length.toString(),
      icon: Table,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "查询耗时",
      value: `${duration}ms`,
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    ...(firstNumCol && sum !== null
      ? [
          {
            label: firstNumCol === 'value' ? '合计计数' : `合计 ${firstNumCol}`,
            value: formatNumber(sum),
            icon: Activity,
            color: "text-chart-4",
            bgColor: "bg-chart-4/10",
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-3">
      {result.confidence ? (
        <div className="flex items-center">
          <ConfidenceBadge confidence={result.confidence} />
          {result.confidence.explain && result.confidence.explain.length > 0 && (
            <div className="ml-3 flex items-center gap-1 text-xs text-muted-foreground">
              {result.confidence.explain.slice(0, 2).map((e, i) => (
                <span key={i}>{e}</span>
              ))}
            </div>
          )}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent to-muted/30 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
