
import { useState } from "react"
import { PageLayout } from "../components/v0-layout/PageLayout"
import { QueryInput } from "../components/v0-dashboard/QueryInput"
import { StatsCards } from "../components/v0-dashboard/StatsCards"
import { AIInsights } from "../components/v0-dashboard/AIInsights"
import { DataPreview } from "../components/v0-dashboard/DataPreview"
import { ChartPreview } from "../components/v0-dashboard/ChartPreview"
import { QuickActions } from "../components/v0-dashboard/QuickActions"
import { RecentQueries } from "../components/v0-dashboard/RecentQueries"
import { EmptyStates } from "../components/v0-dashboard/EmptyStates"

interface V0DashboardPageProps {
  onNavigate?: (page: string) => void
}

export function V0DashboardPage({ onNavigate }: V0DashboardPageProps) {
  const [hasQueryResult, setHasQueryResult] = useState(true)
  const [hasDataSource, setHasDataSource] = useState(true)

  const handleQuery = (query: string) => {
    console.log("[v0] Query submitted:", query)
    setHasQueryResult(true)
  }

  return (
    <PageLayout activeItem="query" onNavigate={onNavigate}>
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          欢迎回来
        </h1>
        <p className="text-muted-foreground">
          用自然语言探索你的数据，AI 将帮助你发现洞察
        </p>
      </div>

      {/* Query Input */}
      <QueryInput onSubmit={handleQuery} />

      {!hasDataSource ? (
        /* Empty State when no data source connected */
        <EmptyStates type="no-datasource" />
      ) : (
        <>
          {/* Quick Actions */}
          <QuickActions />

          {/* Stats Overview */}
          <StatsCards />

          {/* AI Insights - Highlighted Section */}
          <AIInsights />

          {/* Results Section */}
          {hasQueryResult && (
            <div className="grid gap-6 lg:grid-cols-2">
              <DataPreview />
              <ChartPreview />
            </div>
          )}

          {/* Recent Queries */}
          <RecentQueries />
        </>
      )}
    </PageLayout>
  )
}
