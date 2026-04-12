# 对话记忆系统 - 四层架构

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: 会话层 (Session Layer)                              │
│ - 用户可见的对话会话                                          │
│ - 会话标题、时间戳、标签、摘要                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: 语义层 (Semantic Layer)  ⭐ 核心                    │
│ - 向量化 (OpenAI text-embedding-3-small)                     │
│ - 意图识别 (query/analysis/explanation/comparison/action)   │
│ - 实体提取 (metric/dimension/table/value/time_range)        │
│ - 语义相似度计算 (余弦相似度 + 时间衰减)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: 上下文层 (Context Layer)                            │
│ - 对话消息序列管理                                           │
│ - 对话状态追踪 (最后提到的指标、维度)                         │
│ - 关联数据链接 (查询结果、分析数据)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: 存储层 (Storage Layer)                              │
│ - 向量索引 (JSON文件存储, 1536维向量)                        │
│ - 对话历史 (chat-history.json)                              │
│ - 内存缓存 (快速访问)                                        │
└─────────────────────────────────────────────────────────────┘
```

## 核心功能

### 1. 智能召回 (Memory Recall)

根据用户问题智能检索相关历史对话：

```typescript
const result = await window.electronAPI.memory.recall('DAU下降的原因', {
  topK: 5,  // 返回最相关的5条
  sessionId: undefined  // 限制在特定会话
})

// 返回：
{
  relevantMemories: [
    { memory: {...}, similarity: 0.92 },
    { memory: {...}, similarity: 0.85 },
    // ...
  ],
  summary: '在"用户留存分析"中讨论过类似问题',
  suggestedQuestions: [
    '如何扭转这个下降趋势？',
    '不同渠道的表现如何？'
  ],
  confidence: 0.88
}
```

### 2. 上下文窗口 (Context Window)

为AI对话提供历史上下文：

```typescript
const { context } = await window.electronAPI.memory.getContextWindow(
  'DAU最近怎么样',
  undefined,  // sessionId
  2000  // maxTokens
)
// 返回的context可以直接用于AI对话
```

### 3. 会话管理

```typescript
// 获取所有会话（包含语义摘要）
const sessions = await window.electronAPI.memory.getAllSessions()

// 获取单个会话
const session = await window.electronAPI.memory.getSession(sessionId)

// 删除会话（删除所有层的记忆）
await window.electronAPI.memory.deleteSession(sessionId)
```

## 工作流程

### 添加消息

```
用户发送消息
    ↓
memory.addMessage(sessionId, role, content)
    ↓
┌─────────────────────────────────────┐
│ 1. 保存到历史存储 (Layer 4)          │
│    chatHistoryStore.addMessage()    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. 语义化 (Layer 2) - 异步          │
│    - 生成向量 (OpenAI Embeddings)    │
│    - 识别意图                        │
│    - 提取实体                        │
│    - 生成话题标签                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. 添加到向量索引 (Layer 4)          │
│    semanticIndexService.addMemory() │
└─────────────────────────────────────┘
```

### 智能检索

```
用户提问
    ↓
memory.recall(query)
    ↓
┌─────────────────────────────────────┐
│ 1. 理解问题                         │
│    - 识别意图                        │
│    - 提取关键词                      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. 混合检索 (语义 + 关键词)          │
│    - 生成查询向量                    │
│    - 计算相似度（余弦 + 时间衰减）    │
│    - 合并语义和关键词分数            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. 结果处理                         │
│    - 排序并过滤                      │
│    - 生成摘要                        │
│    - 推荐追问                        │
│    - 计算置信度                      │
└─────────────────────────────────────┘
```

## 语义检索算法

### 相似度计算

```typescript
// 基础相似度
similarity = cosine_similarity(query_vector, memory_vector)

// 时间衰减（最近的记忆更重要）
age_days = (now - memory_timestamp) / (24 * 60 * 60 * 1000)
decay_factor = exp(-0.1 * age_days)
similarity *= decay_factor

// 重要性加权
similarity *= (0.5 + memory.importance)
```

### 混合检索

```typescript
// 语义检索 (70%)
semantic_score = cosine_similarity(query, memory)

// 关键词检索 (30%)
keyword_score = matched_keywords / total_keywords

// 合并
final_score = semantic_score * 0.7 + keyword_score * 0.3
```

## 意图分类

| 意图 | 说明 | 示例 |
|------|------|------|
| `query` | 数据查询 | "DAU是多少？" |
| `analysis` | 深度分析 | "分析用户留存情况" |
| `explanation` | 原因解释 | "为什么下降了？" |
| `comparison` | 对比分析 | "对比本月和上月" |
| `action` | 行动建议 | "应该怎么优化？" |
| `general` | 通用对话 | 其他问题 |

## 实体类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `metric` | 指标 | DAU, GMV, 留存率 |
| `dimension` | 维度 | 渠道, 平台, 地区 |
| `table` | 数据表 | users, orders |
| `value` | 具体数值 | 1234, 56.78% |
| `time_range` | 时间范围 | 最近7天, 上个月 |

## UI组件

### MemoryRecallPanel

展示智能检索到的相关历史：

```tsx
<MemoryRecallPanel
  query="DAU下降的原因"
  onSelectMemory={(memory) => {
    // 用户点击了某条历史记录
  }}
  onAskQuestion={(question) => {
    // 用户点击了追问建议
  }}
/>
```

## 数据存储

### 文件结构

```
~/Library/Application Support/data-insight-pro/
├── chat-history.json         # 对话历史
└── memory/
    └── vector-index.json      # 向量索引
```

### 向量索引格式

```json
{
  "index": [
    ["mem_1", {
      "memoryId": "mem_1",
      "sessionId": "session_1",
      "embedding": [0.123, 0.456, ...],  // 1536维
      "timestamp": 1234567890,
      "importance": 0.8
    }]
  ],
  "memories": [
    ["mem_1", {
      "memoryId": "mem_1",
      "sessionId": "session_1",
      "messageId": "msg_1",
      "intent": "query",
      "entities": [
        {"type": "metric", "text": "DAU", "confidence": 0.95}
      ],
      "topics": ["DAU", "用户数据"],
      "content": "DAU是多少？",
      "contentType": "user",
      "timestamp": 1234567890,
      "importance": 0.8
    }]
  ],
  "updatedAt": 1234567890
}
```

## 性能优化

1. **异步向量化**：添加消息时立即返回，向量化在后台进行
2. **内存缓存**：上下文层使用LRU缓存
3. **批量操作**：支持批量向量化
4. **防抖保存**：索引修改后1秒才写入磁盘
5. **定期清理**：30天未更新的记忆自动删除

## 使用场景

### 场景1：AI对话时提供上下文

```typescript
// 用户提问
const userQuery = "最近DAU怎么样？"

// 召回相关历史
const recall = await memory.recall(userQuery)

// 为AI提供上下文
const aiResponse = await aiChatManager.chat([
  {
    role: 'system',
    content: `你是数据分析师。以下是相关的历史对话：\n${recall.summary}`
  },
  {
    role: 'user',
    content: userQuery
  }
])
```

### 场景2：搜索历史分析

```typescript
// 用户输入搜索
const searchResults = await window.electronAPI.memory.recall(searchQuery)

// 展示结果
<MemoryRecallPanel
  query={searchQuery}
  onSelectMemory={(memory) => {
    // 跳转到该会话的消息位置
  }}
/>
```

### 场景3：智能追问

```typescript
// 当前分析完成后
const suggestions = recall.suggestedQuestions
// ["按渠道拆解看看", "和上个月对比", "主要影响因素是什么？"]

// 展示为快捷按钮
{suggestions.map(question => (
  <button onClick={() => askQuestion(question)}>
    {question}
  </button>
))}
```

## 扩展方向

1. **多模态记忆**：支持图片、图表的记忆
2. **关联图谱**：构建实体之间的关联关系
3. **时间序列分析**：识别对话中的时间模式
4. **情感分析**：分析用户问题的情感倾向
5. **自动摘要**：定期生成长期对话摘要
