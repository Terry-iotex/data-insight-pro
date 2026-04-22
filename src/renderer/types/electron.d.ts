/**
 * Electron API 类型定义
 * 与 src/main/preload.ts 保持同步
 */

export interface ConfidenceScore {
  overall: number
  level: 'high' | 'medium' | 'low'
  breakdown?: Record<string, number>
  explain?: string[]
}

export interface AIConfig {
  provider: 'openai' | 'claude' | 'anthropic' | 'minimax' | 'glm'
  apiKey: string
  baseURL?: string
  model: string
}

export interface ChatResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface DatabaseConfig {
  id: string
  name: string
  type: 'mysql' | 'postgres' | 'mongodb' | 'file' | 'demo'
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  connected: boolean
  projectId?: string
  connectMethod?: string
  filePath?: string
  fileContent?: string
}

export interface ElectronAPI {
  ping: () => Promise<any>

  ai: {
    init: (config: AIConfig) => Promise<any>
    chat: (message: string, context?: any) => Promise<any>
    clearHistory: () => Promise<any>
    getHistory: () => Promise<any>
    isReady: () => Promise<boolean>
  }

  db: {
    connect: (config: any) => Promise<any>
    disconnect: (config: any) => Promise<any>
    test: (config: any) => Promise<any>
    query: (config: any, sql: string) => Promise<any>
    tables: (config: any) => Promise<any>
    testEnhanced: (config: any) => Promise<any>
    securityTips: (config: any) => Promise<any>
  }

  database: {
    connect: (config: any) => Promise<any>
    disconnect: (config: any) => Promise<any>
    test: (config: any) => Promise<any>
    query: (config: any, sql: string) => Promise<any>
    tables: (config: any) => Promise<any>
  }

  schema: {
    cache: (config: any) => Promise<any>
    getTable: (config: any, tableName: string) => Promise<any>
    updateColumn: (config: any, tableName: string, columnName: string, description: string) => Promise<any>
    search: (config: any, keyword: string) => Promise<any>
    describe: (config: any) => Promise<any>
  }

  metrics: {
    getAll: () => Promise<any>
    getByCategory: (category: string) => Promise<any>
    add: (metric: any) => Promise<any>
    update: (metricId: string, updates: any) => Promise<any>
    delete: (metricId: string) => Promise<any>
    generateSQL: (query: any, tableName?: string) => Promise<any>
  }

  sql: {
    validate: (sql: string) => Promise<any>
    auditLog: (limit?: number) => Promise<any>
    summary: (sql: string) => Promise<any>
  }

  result: {
    generateMetadata: (params: any) => Promise<any>
    formatMetadata: (metadata: any) => Promise<any>
  }

  charts: {
    recommend: (result: any) => Promise<any>
    recommendMultiple: (results: any[]) => Promise<any>
  }

  dictionary: {
    metrics: {
      getAll: () => Promise<any>
      search: (keyword: string) => Promise<any>
      add: (metric: any) => Promise<any>
      update: (id: string, updates: any) => Promise<any>
      delete: (id: string) => Promise<any>
    }
    fields: {
      getAll: () => Promise<any>
      getByTable: (table: string) => Promise<any>
      update: (table: string, column: string, updates: any) => Promise<any>
      search: (keyword: string) => Promise<any>
    }
    dimensions: {
      getAll: () => Promise<any>
      add: (dimension: any) => Promise<any>
    }
    generateAIDesc: () => Promise<any>
    export: () => Promise<any>
    import: (data: any) => Promise<any>
  }

  metricsV2: {
    getAll: () => Promise<any>
    get: (id: string) => Promise<any>
    search: (keyword: string) => Promise<any>
    add: (metric: any) => Promise<any>
    update: (id: string, updates: any) => Promise<any>
    delete: (id: string) => Promise<any>
    validateUsage: (metricId: string, dimensions: string[]) => Promise<any>
    generateConstrainedSQL: (metricId: string, dimensions: string[], timeRange?: string) => Promise<any>
    composite: {
      getAll: () => Promise<any>
      add: (metric: any) => Promise<any>
      generateCompositeSQL: (compositeMetricId: string) => Promise<any>
    }
  }

  confidence: {
    calculate: (input: any) => Promise<{ success: boolean; data: ConfidenceScore }>
    extractSQLStats: (sql: string) => Promise<any>
    quickAssess: (sql: string, hasMetric: boolean) => Promise<any>
  }

  analysis: {
    analyze: (request: any) => Promise<any>
    generateSummary: (result: any) => Promise<any>
    recognizeTable: (db: DatabaseConfig, tableName: string) => Promise<any>
    run: (db: DatabaseConfig, tableName: string, templateId?: string) => Promise<any>
    runTemplate: (db: DatabaseConfig, tableName: string, templateId: string) => Promise<any>
    getTableData: (db: DatabaseConfig, tableName: string, limit?: number) => Promise<any>
  }

  analyze: {
    run: (request: any) => Promise<any>
  }

  chat: {
    withContext: (sessionId: string, question: string) => Promise<any>
    createSession: (initialMessage: string, metadata?: any) => Promise<any>
    getSession: (sessionId: string) => Promise<any>
    getAllSessions: () => Promise<any>
    getCurrentSession: () => Promise<any>
    setCurrentSession: (sessionId: string) => Promise<any>
    deleteSession: (sessionId: string) => Promise<any>
    clearAllSessions: () => Promise<any>
  }

  memory: {
    recall: (query: string, options?: any) => Promise<any>
    getContextWindow: (query: string, sessionId?: string, maxTokens?: number) => Promise<any>
    getSession: (sessionId: string) => Promise<any>
    getAllSessions: () => Promise<any>
    addMessage: (sessionId: string, role: string, content: string) => Promise<any>
    deleteSession: (sessionId: string) => Promise<any>
    getStats: () => Promise<any>
  }

  security: {
    getConfig: () => Promise<any>
    updateConfig: (updates: any) => Promise<any>
    checkTableAccess: (tableName: string) => Promise<any>
    checkSQLSecurity: (sql: string) => Promise<any>
    getTips: () => Promise<any>
    getDescription: () => Promise<any>
  }

  anonymize: {
    anonymizeData: (tableName: string, rows: any[], enabled: boolean) => Promise<any>
    prepareForAI: (data: any, config?: any) => Promise<any>
    isSensitiveField: (fieldName: string) => Promise<any>
    generateReport: (result: any) => Promise<any>
    getAllRules: () => Promise<any>
  }

  audit: {
    log: (entry: any) => Promise<any>
    getLogs: (limit: number, offset: number) => Promise<any>
    getStats: (timeRange?: any) => Promise<any>
    export: (format: 'json' | 'csv') => Promise<{ success: boolean; content: string }>
    getSummary: (limit: number) => Promise<any>
    clear: () => Promise<any>
  }

  insights: {
    detectAnomalies: (metrics: any[]) => Promise<any>
    generateReport: (metrics: any[]) => Promise<any>
    breakdownSql: (metricName: string, tableName: string, dateField: string) => Promise<any>
  }

  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<void>
    delete: (key: string) => Promise<void>
  }

  dialog: {
    openFile: (options?: any) => Promise<any>
  }

  file: {
    read: (filePath: string) => Promise<any>
    register: (dbId: string, filePath: string, fileName: string, content?: string) => Promise<any>
    getTable: (dbId: string, tableName: string) => Promise<any>
    debugRegistry: () => Promise<any>
  }

  nl: {
    generateSQL: (databaseType: any, query: string, context?: any) => Promise<any>
    explainSQL: (sql: string) => Promise<any>
    getSuggestions: (query: string) => Promise<any>
    getRelevantMetrics: (query: string) => Promise<any>
    recordCorrection: (naturalLanguage: string, generatedSQL: string, correctedSQL: string, userFeedback: string) => Promise<any>
  }

  funnel: {
    discover: (config: any) => Promise<any>
    save: (funnel: any) => Promise<any>
    list: () => Promise<any>
    delete: (id: string) => Promise<any>
    get: (id: string) => Promise<any>
  }

  templates: {
    getAll: () => Promise<any>
    create: (template: any) => Promise<any>
    update: (id: string, updates: any) => Promise<any>
    delete: (id: string) => Promise<any>
    use: (id: string) => Promise<any>
    search: (keyword: string) => Promise<any>
    getPopular: (limit?: number) => Promise<any>
  }

  tableAnalysis: {
    analyzeSchema: (filePath: string, fileName: string) => Promise<any>
    getTemplateLibrary: () => Promise<any>
    batchAnalyze: (tables: any[]) => Promise<any>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}