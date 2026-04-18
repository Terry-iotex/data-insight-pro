// 分析模板库 - 涵盖常见业务场景

export type TemplateCategory =
  | 'growth'
  | 'retention'
  | 'revenue'
  | 'conversion'
  | 'operations'
  | 'ecommerce'
  | 'finance'
  | 'content'
  | 'general'

export interface AnalysisTemplate {
  id: string
  name: string
  icon: string         // lucide-react icon name
  description: string
  category: TemplateCategory
  categoryLabel: string
  // 描述该模板需要什么类型的数据，供 AI 和模糊匹配使用
  dataRequirements: string
  // 点击后预填充到分析输入框的问题
  sampleQuestion: string
  color: string
  bgColor: string
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  growth: '增长分析',
  retention: '留存分析',
  revenue: '收入分析',
  conversion: '转化漏斗',
  operations: '运营效率',
  ecommerce: '电商分析',
  finance: '财务分析',
  content: '内容流量',
  general: '通用分析',
}

export const ANALYSIS_TEMPLATES: AnalysisTemplate[] = [
  // ── 增长 ──
  {
    id: 'user_growth_trend',
    name: '用户增长趋势',
    icon: 'TrendingUp',
    description: '新增用户随时间的增长走势',
    category: 'growth',
    categoryLabel: '增长分析',
    dataRequirements: '需要包含用户注册时间或创建时间字段的表格，记录每个用户何时加入',
    sampleQuestion: '分析最近30天每天的新增用户数量，展示增长趋势',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'dau_wau_mau',
    name: 'DAU/WAU/MAU',
    icon: 'Users',
    description: '日/周/月活跃用户数统计',
    category: 'growth',
    categoryLabel: '增长分析',
    dataRequirements: '需要包含用户ID和活跃时间的行为日志表，记录用户每次访问或操作',
    sampleQuestion: '统计最近30天的日活跃用户数（DAU），并计算月活（MAU）和日活月活比',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'new_user_acquisition',
    name: '用户获取分析',
    icon: 'UserPlus',
    description: '来源渠道带来的新用户数量',
    category: 'growth',
    categoryLabel: '增长分析',
    dataRequirements: '需要包含用户来源渠道或推广来源字段的注册/用户表',
    sampleQuestion: '按来源渠道统计新用户数量，对比各渠道的获客效果',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },

  // ── 留存 ──
  {
    id: 'user_retention',
    name: '用户留存率',
    icon: 'Repeat',
    description: 'D1/D7/D30 留存率分析',
    category: 'retention',
    categoryLabel: '留存分析',
    dataRequirements: '需要包含用户ID和活跃时间的行为日志，能追踪用户在不同时间点的回访情况',
    sampleQuestion: '计算用户的次日留存率（D1）、7日留存率（D7）和30日留存率（D30）',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'churn_analysis',
    name: '流失分析',
    icon: 'UserMinus',
    description: '用户流失率和流失原因分析',
    category: 'retention',
    categoryLabel: '留存分析',
    dataRequirements: '需要包含用户ID、最后活跃时间或活跃状态的表格',
    sampleQuestion: '分析近90天内流失的用户比例，流失定义为超过30天未活跃',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },

  // ── 收入 ──
  {
    id: 'revenue_trend',
    name: '收入趋势',
    icon: 'DollarSign',
    description: '收入随时间的变化趋势',
    category: 'revenue',
    categoryLabel: '收入分析',
    dataRequirements: '需要包含金额/收入字段和时间字段的订单、交易或收入记录表',
    sampleQuestion: '统计最近6个月每月的总收入，展示收入趋势和环比增长率',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'arpu_arppu',
    name: 'ARPU/ARPPU',
    icon: 'BarChart3',
    description: '人均收入和付费用户人均收入',
    category: 'revenue',
    categoryLabel: '收入分析',
    dataRequirements: '需要同时包含用户ID和付款金额的交易记录表',
    sampleQuestion: '计算过去30天的ARPU（每活跃用户平均收入）和ARPPU（每付费用户平均收入）',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },

  // ── 转化 ──
  {
    id: 'conversion_funnel',
    name: '转化漏斗',
    icon: 'Filter',
    description: '各步骤的转化率和流失情况',
    category: 'conversion',
    categoryLabel: '转化漏斗',
    dataRequirements: '需要包含用户行为事件或操作步骤的日志表，记录用户在不同阶段的行为',
    sampleQuestion: '分析用户从注册到首次付款的转化漏斗，计算每步的转化率',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'signup_conversion',
    name: '注册转化分析',
    icon: 'LogIn',
    description: '访客到注册用户的转化率',
    category: 'conversion',
    categoryLabel: '转化漏斗',
    dataRequirements: '需要包含访问/注册事件和时间戳的行为日志或用户表',
    sampleQuestion: '分析最近7天每天的注册转化率，即注册用户数/访问用户数',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },

  // ── 运营 ──
  {
    id: 'feature_usage',
    name: '功能使用率',
    icon: 'Activity',
    description: '各功能模块的使用频率统计',
    category: 'operations',
    categoryLabel: '运营效率',
    dataRequirements: '需要包含功能名称/事件类型和使用次数的行为日志表',
    sampleQuestion: '统计各功能模块的使用次数和使用用户数，找出最受欢迎的功能',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'session_analysis',
    name: '会话分析',
    icon: 'Clock',
    description: '用户平均会话时长和频率',
    category: 'operations',
    categoryLabel: '运营效率',
    dataRequirements: '需要包含会话ID、开始时间、结束时间或时长字段的会话记录表',
    sampleQuestion: '分析用户平均会话时长、每日会话次数分布，以及高峰使用时段',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },

  // ── 电商 ──
  {
    id: 'order_analysis',
    name: '订单分析',
    icon: 'ShoppingCart',
    description: '订单量、GMV、客单价统计',
    category: 'ecommerce',
    categoryLabel: '电商分析',
    dataRequirements: '需要包含订单ID、下单时间、订单金额、订单状态的订单表',
    sampleQuestion: '统计最近30天每天的订单数量、总GMV和平均客单价，展示趋势',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'repurchase_rate',
    name: '复购率分析',
    icon: 'RefreshCw',
    description: '用户重复购买行为分析',
    category: 'ecommerce',
    categoryLabel: '电商分析',
    dataRequirements: '需要包含用户ID和购买时间的订单记录，能追踪同一用户的多次购买',
    sampleQuestion: '计算最近90天的用户复购率，以及购买次数的分布情况',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'product_performance',
    name: '商品表现',
    icon: 'Package',
    description: '各商品销量和收入排名',
    category: 'ecommerce',
    categoryLabel: '电商分析',
    dataRequirements: '需要包含商品ID/名称、销售数量、销售金额的商品销售记录表',
    sampleQuestion: '统计销售量前10的商品，以及各商品的收入贡献占比',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },

  // ── 财务 ──
  {
    id: 'expense_analysis',
    name: '支出分析',
    icon: 'Receipt',
    description: '各类支出的分布和趋势',
    category: 'finance',
    categoryLabel: '财务分析',
    dataRequirements: '需要包含支出金额、支出类别和日期的财务记录或账单表',
    sampleQuestion: '按支出类别统计最近3个月的支出总额，并展示各类别的占比',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'profit_trend',
    name: '利润趋势',
    icon: 'TrendingUp',
    description: '收入与支出对比，利润走势',
    category: 'finance',
    categoryLabel: '财务分析',
    dataRequirements: '需要同时包含收入和支出数据，可以是同一张表的不同字段，或两张关联表',
    sampleQuestion: '对比每月的收入和支出，计算净利润并展示利润率趋势',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },

  // ── 内容 ──
  {
    id: 'content_performance',
    name: '内容表现',
    icon: 'FileText',
    description: '文章/内容的浏览量和互动数据',
    category: 'content',
    categoryLabel: '内容流量',
    dataRequirements: '需要包含内容ID/标题、浏览量、点赞或评论数等互动指标的内容数据表',
    sampleQuestion: '统计浏览量前10的内容，并分析内容的平均互动率',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    id: 'traffic_analysis',
    name: '流量分析',
    icon: 'Globe',
    description: '页面访问量和来源渠道分析',
    category: 'content',
    categoryLabel: '内容流量',
    dataRequirements: '需要包含页面URL、访问时间、访问来源或IP的访问日志表',
    sampleQuestion: '分析最近7天的总页面浏览量（PV）、独立访客数（UV），以及流量来源分布',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },

  // ── 通用 ──
  {
    id: 'data_overview',
    name: '数据概览',
    icon: 'LayoutDashboard',
    description: '表格基础统计和字段分布',
    category: 'general',
    categoryLabel: '通用分析',
    dataRequirements: '适用于任何类型的数据表，展示记录总数、字段分布等基础统计',
    sampleQuestion: '对这张表做一个基础统计概览，包括总记录数、各字段的取值分布',
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-500/10',
  },
  {
    id: 'time_series',
    name: '时序趋势',
    icon: 'LineChart',
    description: '任意指标随时间的变化趋势',
    category: 'general',
    categoryLabel: '通用分析',
    dataRequirements: '需要包含日期或时间字段，以及至少一个数值字段的表格',
    sampleQuestion: '按时间维度统计主要指标的变化趋势，找出波峰和波谷',
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-500/10',
  },
]

export function getTemplateById(id: string): AnalysisTemplate | undefined {
  return ANALYSIS_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: TemplateCategory): AnalysisTemplate[] {
  return ANALYSIS_TEMPLATES.filter(t => t.category === category)
}

export function getAllCategories(): TemplateCategory[] {
  return Object.keys(CATEGORY_LABELS) as TemplateCategory[]
}
