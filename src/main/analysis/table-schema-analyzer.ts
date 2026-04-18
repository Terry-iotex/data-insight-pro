// 表格字段智能分析器 - 使用 AI 理解表格含义，匹配分析模板

import { AIChatManager } from '../ai/adapter'
import { ANALYSIS_TEMPLATES } from './template-library'

export interface ColumnInfo {
  name: string
  sampleValues: string[]
  inferredType: 'string' | 'number' | 'date' | 'boolean' | 'id' | 'unknown'
}

export interface TableSchemaAnalysisResult {
  fileName: string
  tableType: string           // 对表格用途的自然语言描述
  confidence: number          // 0-1，AI 或启发式方法的置信度
  suggestedTemplateIds: string[]
  needsConfirmation: boolean  // 置信度低于阈值时为 true
  columns: ColumnInfo[]
  analysisSource: 'ai' | 'heuristic'
}

// 从 CSV 内容中提取结构信息（表头 + 前 N 行样本）
export function parseCsvPreview(content: string, maxRows = 10): {
  headers: string[]
  sampleRows: string[][]
} {
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length === 0) return { headers: [], sampleRows: [] }

  const parseRow = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseRow(lines[0])
  const sampleRows = lines.slice(1, maxRows + 1).map(parseRow)
  return { headers, sampleRows }
}

// 推断单列的数据类型
function inferColumnType(name: string, values: string[]): ColumnInfo['inferredType'] {
  const nonEmpty = values.filter(v => v && v !== 'null' && v !== 'undefined' && v !== 'N/A')
  if (nonEmpty.length === 0) return 'unknown'

  // 日期模式
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/,
    /^\d{2}\/\d{2}\/\d{4}/,
    /^\d{4}\/\d{2}\/\d{2}/,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/,
  ]
  if (nonEmpty.every(v => datePatterns.some(p => p.test(v)))) return 'date'

  // 纯数字
  if (nonEmpty.every(v => !isNaN(Number(v.replace(/,/g, ''))))) return 'number'

  // 布尔值
  const boolValues = new Set(['true', 'false', '1', '0', 'yes', 'no', '是', '否'])
  if (nonEmpty.every(v => boolValues.has(v.toLowerCase()))) return 'boolean'

  // ID 启发：字段名含 _id、id_ 或结尾是 id，且值看起来像 hash/uuid/数字
  const nameLower = name.toLowerCase()
  if (nameLower.includes('_id') || nameLower.startsWith('id_') || nameLower === 'id') return 'id'

  return 'string'
}

// 构建列信息数组
function buildColumnInfos(headers: string[], sampleRows: string[][]): ColumnInfo[] {
  return headers.map((name, i) => {
    const sampleValues = sampleRows.map(r => r[i] ?? '').filter(Boolean).slice(0, 5)
    return {
      name,
      sampleValues,
      inferredType: inferColumnType(name, sampleValues),
    }
  })
}

// AI 分析：把 schema 信息发给 AI，让它理解表格用途并匹配模板
async function analyzeWithAI(
  aiManager: AIChatManager,
  fileName: string,
  columns: ColumnInfo[],
): Promise<{ tableType: string; confidence: number; suggestedTemplateIds: string[] }> {
  const templateSummary = ANALYSIS_TEMPLATES.map(t =>
    `- ${t.id}: ${t.name}（${t.categoryLabel}）- ${t.dataRequirements}`
  ).join('\n')

  const columnDesc = columns.map(c =>
    `  - ${c.name}（类型: ${c.inferredType}，样本值: ${c.sampleValues.slice(0, 3).join(', ')}）`
  ).join('\n')

  const prompt = `你是一个数据分析专家。请分析以下表格的字段结构，判断它包含什么业务数据，适合做哪些分析。

文件名: ${fileName}
字段列表:
${columnDesc}

可选的分析模板:
${templateSummary}

请严格以 JSON 格式回答（不要加任何注释或 markdown）:
{
  "tableType": "一句话描述这个表格的业务用途",
  "confidence": 0到1之间的数字,
  "suggestedTemplateIds": ["最多3个最匹配的模板id"],
  "reasoning": "简短说明你的判断依据"
}`

  try {
    const response = await aiManager.chat(prompt, {})
    const content = response?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI 响应不含 JSON')

    const parsed = JSON.parse(jsonMatch[0])
    // 校验返回的模板 id 是否真实存在
    const validIds = (parsed.suggestedTemplateIds || []).filter(
      (id: string) => ANALYSIS_TEMPLATES.some(t => t.id === id)
    )
    return {
      tableType: parsed.tableType || '未知类型',
      confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0.5)),
      suggestedTemplateIds: validIds.slice(0, 3),
    }
  } catch {
    throw new Error('AI 分析解析失败')
  }
}

// 启发式分析：当没有 AI 时的 fallback，基于字段组合而非关键字匹配
function analyzeWithHeuristic(
  _fileName: string,
  columns: ColumnInfo[],
): { tableType: string; confidence: number; suggestedTemplateIds: string[] } {
  const names = columns.map(c => c.name.toLowerCase())
  const types = columns.map(c => c.inferredType)

  const hasDate = types.includes('date') ||
    names.some(n => /date|time|at$|_at|created|updated|timestamp/.test(n))
  const hasUserId = names.some(n => /user.*id|uid|account.*id|member.*id/.test(n))
  const hasAmount = names.some(n => /amount|price|revenue|income|cost|fee|total|money|pay|gross/.test(n)) ||
    (types.filter(t => t === 'number').length >= 2 && hasDate)
  const hasEvent = names.some(n => /event|action|type|behavior|activity|log|track/.test(n))
  const hasContent = names.some(n => /title|content|article|post|page|url|view|pv|uv/.test(n))
  const hasProduct = names.some(n => /product|item|sku|goods|category|brand/.test(n))
  const hasOrder = names.some(n => /order|purchase|transaction|invoice|bill/.test(n))

  const suggested: string[] = []
  let tableType = '通用数据表'
  let confidence = 0.4

  // 电商订单：有订单+金额
  if (hasOrder && hasAmount) {
    tableType = '电商订单记录'
    suggested.push('order_analysis', 'repurchase_rate', 'revenue_trend')
    confidence = 0.72
  }
  // 用户行为日志：有用户ID+事件+时间
  else if (hasUserId && hasEvent && hasDate) {
    tableType = '用户行为日志'
    suggested.push('user_retention', 'feature_usage', 'dau_wau_mau')
    confidence = 0.72
  }
  // 用户注册/信息表：有用户ID+注册时间
  else if (hasUserId && hasDate && !hasEvent) {
    tableType = '用户信息/注册数据'
    suggested.push('user_growth_trend', 'new_user_acquisition', 'dau_wau_mau')
    confidence = 0.65
  }
  // 收入/财务：有金额+时间，但没有订单特征
  else if (hasAmount && hasDate && !hasOrder) {
    tableType = '财务/收入记录'
    suggested.push('revenue_trend', 'profit_trend', 'expense_analysis')
    confidence = 0.60
  }
  // 内容/流量：有内容字段
  else if (hasContent && hasDate) {
    tableType = '内容/流量数据'
    suggested.push('content_performance', 'traffic_analysis', 'time_series')
    confidence = 0.60
  }
  // 商品/库存
  else if (hasProduct) {
    tableType = '商品/库存数据'
    suggested.push('product_performance', 'order_analysis', 'data_overview')
    confidence = 0.55
  }
  // 有时间但没有其他特征 → 时序数据
  else if (hasDate) {
    tableType = '带时间维度的数据'
    suggested.push('time_series', 'data_overview')
    confidence = 0.45
  }
  // 兜底
  else {
    suggested.push('data_overview', 'time_series')
    confidence = 0.35
  }

  return { tableType, confidence, suggestedTemplateIds: suggested.slice(0, 3) }
}

// 主入口：分析一个 CSV 文件的 schema
export async function analyzeTableSchema(
  fileName: string,
  csvContent: string,
  aiManager?: AIChatManager | null,
): Promise<TableSchemaAnalysisResult> {
  const { headers, sampleRows } = parseCsvPreview(csvContent, 10)
  const columns = buildColumnInfos(headers, sampleRows)

  let tableType: string
  let confidence: number
  let suggestedTemplateIds: string[]
  let analysisSource: 'ai' | 'heuristic'

  if (aiManager) {
    try {
      const result = await analyzeWithAI(aiManager, fileName, columns)
      tableType = result.tableType
      confidence = result.confidence
      suggestedTemplateIds = result.suggestedTemplateIds
      analysisSource = 'ai'
    } catch {
      // AI 失败时降级到启发式
      const result = analyzeWithHeuristic(fileName, columns)
      tableType = result.tableType
      confidence = result.confidence
      suggestedTemplateIds = result.suggestedTemplateIds
      analysisSource = 'heuristic'
    }
  } else {
    const result = analyzeWithHeuristic(fileName, columns)
    tableType = result.tableType
    confidence = result.confidence
    suggestedTemplateIds = result.suggestedTemplateIds
    analysisSource = 'heuristic'
  }

  // 如果连通用模板都没有，保底加上 data_overview
  if (suggestedTemplateIds.length === 0) {
    suggestedTemplateIds = ['data_overview']
  }

  return {
    fileName,
    tableType,
    confidence,
    suggestedTemplateIds,
    needsConfirmation: confidence < 0.65,
    columns,
    analysisSource,
  }
}
