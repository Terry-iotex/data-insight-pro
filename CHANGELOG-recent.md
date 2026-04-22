# Deciflow 更新日志

> 本次更新涵盖 996848e → a71343a 共 6 个提交

---

## 1. 快捷分析模块重构

### 问题背景
用户点击快捷分析模板后，输入框虽有 NL 语句，但按回车后无数据显示。

### 修复内容

**QueryInput 组件**（`src/renderer/components/QueryInput/index.tsx`）
- 新增 `pendingQuery` 和 `onPendingQueryConsumed` 属性支持
- 添加 `useEffect` 监听 `pendingQuery`：自动填入输入框并延迟 100ms 自动执行
- 点击模板按钮 → 自动填入 NL 语句 → 自动执行，无需手动按回车

**快捷分析显示逻辑**（`src/renderer/stores/AnalysisTemplateStore.tsx`）
- `DEFAULT_PINNED` 改为空数组 `[]`（原为 `user_retention`、`user_growth_trend` 等固定4个模板）
- `getDisplayTemplates` 移除 pinned 合并逻辑，只返回 `recommendedIds`
- 快捷分析完全由一键分析的推荐结果驱动，每次分析结果不同，推荐模板也不同

### 行为变化
| 场景 | 旧行为 | 新行为 |
|------|--------|--------|
| 未分析时 | 显示4个固定模板 | 显示为空（需先做一键分析） |
| 分析 transactions 表 | 显示 user_retention 等通用模板 | 显示收入趋势、支付分布等交易类模板 |
| 点击模板后 | NL 语句填入，需手动按回车 | NL 语句填入后自动执行 |

---

## 2. 模板 SQL 执行 JS 聚合（文件模式）

### 问题背景
`analysis:run-template` 在 CSV 文件模式下直接返回 SQL 原始行（如 `SELECT txn_time, amount`），没有按月聚合，导致图表数据只有一条记录（`name` 列为空）。

### 修复内容

**`analysis:run-template` 处理逻辑**（`src/main/index.ts`）
- 文件模式下新增 `tryAggregateForTemplate` 聚合逻辑（与 `analysis:run` 一致）
- `revenue_trend` 等时间类模板：自动按月/周/日聚合金额
- 聚合失败时回退到直接执行 SQL

```typescript
// 新增逻辑
const aggregated = tryAggregateForTemplate(templateId, columns, rawRows, dbType)
if (aggregated) {
  dbResult = aggregated  // 使用 JS 聚合结果
} else {
  dbResult = fileTableRegistry.query(db.id, analysis.sql)
}
```

---

## 3. 图表数值格式化（2位小数）

### 修复位置
- `src/renderer/components/ChartDisplay/index.tsx` — 4个图表（折线/柱状/饼/面积）的 Tooltip 加 `formatter`
- `src/renderer/components/v0-dashboard/ChartPreview.tsx` — 3个图表 Tooltip 加 `formatter`
- `src/renderer/utils/format.ts` — 新增 `formatNumber` / `formatPercent` 工具函数

### 格式化规则
- 数值保留2位小数（`toFixed(2)`）
- 1000以上数字用千分位格式化（如 `114,130.10`）
- 整数不显示小数点（如 `100` 而非 `100.00`）

---

## 4. 表类型识别（transactions 表）

### 问题背景
`transactions_v2` 表被错误识别为 `conversion`（用户行为表），导致快捷分析显示留存、增长等模板。

### 修复内容（`src/main/index.ts`）

**inferTableType 两层推断**
- 第一层：表名关键词匹配（`transaction`、`payments` 等，含复数形式）
- 第二层：列字段检测兜底（`hasAmount + hasPayment + 无 product 字段 → transaction`）

**getSuggestedTemplates 优先级调整**
- 优先使用 `inferTableType` 推断的 `tableType.type`（表名匹配，最可靠）
- 传入 `tableType` 优先于列字段重新检测
- `suggestedTemplateIds` 返回值：`null` → `[]`（避免空指针）

**transaction 表推荐的模板**
```
revenue_trend, data_overview, time_series, category_performance,
payment_distribution, refund_analysis, top_n_ranking
```

---

## 5. 其他修复

| 文件 | 修复内容 |
|------|----------|
| `src/main/index.ts` | `fallbackByType` 变量提升（解决"使用前声明"错误） |
| `src/main/index.ts` | `recognize-table` 重复 `table` 变量合并 |
| `src/main/analysis/template-sql-generator.ts` | `cohort_retention`/`reactivation` 新增缺失的 `dbType` 参数 |
| `src/renderer/pages/V0DashboardPage.tsx` | `tableName` 变量作用域修复（`currentTableName` 派生变量） |
| `src/renderer/components/TableSchemaOverview.tsx` | 新增表概览组件，支持字段展示和数据预览 |
| `src/renderer/stores/AnalysisTemplateStore.tsx` | 删除调试代码 `__debugRecIds` |

---

## 6. 新增文件

| 文件 | 说明 |
|------|------|
| `src/renderer/utils/format.ts` | 数字和百分比格式化工具 |
| `src/main/analysis/template-sql-generator.ts` | 模板 SQL 生成器（含 JS 聚合逻辑） |
| `src/main/database/file-registry.ts` | CSV 文件表注册与管理 |
| `src/renderer/components/v0-dashboard/TableSchemaOverview.tsx` | 表概览弹窗组件 |

---

## 提交记录

```
a71343a fix: 快捷分析模板执行结果空白、QueryInput pendingQuery 未自动执行
9c37d8e feat: 数据源管理、首页选择器、UI 交互多项改进
1ac77f6 fix: 修复 demo 数据库无法连接及引导步骤行数错误
2647e34 feat: 增强数据库连接管理与 AI 适配器功能
996848e feat: 全面 UI 优化与 18 项问题修复
```
