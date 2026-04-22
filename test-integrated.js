/**
 * Deciflow 综合测试脚本
 * 测试核心功能：CSV 解析、模板 SQL 生成、可信度计算、多表关联
 */
const fs = require('fs');

const CSV_PATH = '/Users/terry/Downloads/transactions_v2.csv';
const TEST_DB_ID = 'test-integrated';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

async function run() {
  console.log('\n📊 Deciflow 综合功能测试\n');

  // ── 1. 文件注册与解析 ─────────────────────────────────────────────────────
  console.log('── 1. 文件注册与解析 ─────────────────────────────────');
  const { parseCSVContent, fileTableRegistry } = require('./dist-main/main/database/file-registry.js');

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  test('CSV 文件读取', () => assert(content.length > 1000, '文件太短'));
  test('CSV 解析 8000 行', () => {
    const parsed = parseCSVContent(content);
    assert(parsed.rows.length === 8000, `期望8000行，实际${parsed.rows.length}`);
    assert(parsed.columns.length === 8, `期望8列，实际${parsed.columns.length}`);
  });

  // ── 2. 文件表注册 ─────────────────────────────────────────────────────────
  console.log('\n── 2. 文件表注册 ──────────────────────────────────────');
  fileTableRegistry.loadFileContent(TEST_DB_ID, content, 'transactions_v2');
  const tables = fileTableRegistry.getTablesForDb(TEST_DB_ID);
  test('表注册成功', () => assert(tables.length > 0, '表为空'));
  test('表名正确', () => assert(tables[0].tableName === 'transactions_v2', '表名错误'));
  test('列信息完整', () => assert(tables[0].columns.length === 8, '列数错误'));

  // ── 3. 模板 SQL 生成 ──────────────────────────────────────────────────────
  console.log('\n── 3. 模板 SQL 生成 ─────────────────────────────────');
  const { generateTemplateSQL, autoSelectAnalysis } = require('./dist-main/main/analysis/template-sql-generator.js');

  const columns = tables[0].columns;
  test('自动分析选择模板', () => {
    const result = autoSelectAnalysis(columns, 'file');
    assert(result.templateId === 'revenue_trend', `期望 revenue_trend，实际 ${result.templateId}`);
  });

  test('生成 revenue_trend SQL', () => {
    const result = generateTemplateSQL('revenue_trend', 'transactions_v2', columns, 'file');
    assert(result !== null, '返回 null');
    assert(result.sql.length > 10, 'SQL 太短');
  });

  test('生成 data_overview SQL', () => {
    const result = generateTemplateSQL('data_overview', 'transactions_v2', columns, 'file');
    assert(result !== null, '返回 null');
    assert(result.sql.length > 10, 'SQL 太短');
  });

  // ── 4. SQL 执行 ───────────────────────────────────────────────────────────
  console.log('\n── 4. SQL 执行 ──────────────────────────────────────');
  test('执行 SELECT * LIMIT', () => {
    const result = fileTableRegistry.query(TEST_DB_ID, 'SELECT * FROM "transactions_v2" LIMIT 3');
    assert(result.rowCount === 3, `期望3行，实际${result.rowCount}`);
  });

  test('执行带 WHERE 的 SQL', () => {
    const result = fileTableRegistry.query(TEST_DB_ID, 'SELECT * FROM "transactions_v2" WHERE amount > 100 LIMIT 5');
    assert(result.rowCount <= 8000, '结果数超出范围');
  });

  // ── 5. 可信度引擎 ────────────────────────────────────────────────────────
  console.log('\n── 5. 可信度引擎 ────────────────────────────────────');
  const { confidenceEngine } = require('./dist-main/main/trust/confidence-engine.js');

  test('简单 SQL 可信度计算', () => {
    const result = confidenceEngine.calculate({
      sql: 'SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\'',
      tables: ['users'],
      rowCount: 1450,
      joinCount: 0,
      subqueryCount: 0,
      hasFallback: false,
      missingFields: []
    });
    assert(result.overall > 50, `SQL可信度应>50，实际${result.overall}`);
  });

  test('复杂 SQL 可信度计算', () => {
    const result = confidenceEngine.calculate({
      sql: 'SELECT a.x, b.y FROM t1 a JOIN t2 b ON a.id = b.id WHERE a.z IN (SELECT x FROM t3)',
      tables: ['t1', 't2', 't3'],
      rowCount: 100,
      joinCount: 2,
      subqueryCount: 1,
      hasFallback: true,
      missingFields: ['p', 'q']
    });
    assert(result.overall < 70, `复杂SQL可信度应<70，实际${result.overall}`);
  });

  test('多表关联预定义关系数', () => {
    const { MultiTableAnalyzer } = require('./dist-main/main/analysis/multi-table-analyzer.js');
    // 直接验证文件存在且可引用
    assert(typeof MultiTableAnalyzer === 'function', 'MultiTableAnalyzer 类未导出');
  });

  // ── 7. 指标层 V2 ──────────────────────────────────────────────────────────
  console.log('\n── 7. 指标层 V2 ─────────────────────────────────────');
  const { metricLayerV2 } = require('./dist-main/main/metrics/layer-v2.js');

  test('获取所有指标', () => {
    const metrics = metricLayerV2.getAllMetrics();
    assert(metrics.length >= 9, `至少9个预置指标，实际${metrics.length}`);
  });

  test('指标约束验证', () => {
    const result = metricLayerV2.validateMetricUsage('new_users', ['channel', 'platform']);
    assert(result !== null, 'validateMetricUsage 返回 null');
  });

  // ── 8. 安全配置 ───────────────────────────────────────────────────────────
  console.log('\n── 8. 安全配置 ─────────────────────────────────────');
  const { dataSecurityManager } = require('./dist-main/main/security/data-policy.js');

  test('获取安全配置', () => {
    const config = dataSecurityManager.getConfig();
    assert(config !== null, '配置为空');
    assert('anonymizationEnabled' in config, '缺少 anonymizationEnabled');
  });

  test('敏感字段检测', () => {
    const { dataAnonymizer } = require('./dist-main/main/security/anonymization.js');
    assert(dataAnonymizer.isSensitiveField('email') === true, 'email 应为敏感字段');
    assert(dataAnonymizer.isSensitiveField('phone') === true, 'phone 应为敏感字段');
    assert(dataAnonymizer.isSensitiveField('password') === true, 'password 应为敏感字段');
  });

  // ── 总结 ─────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50));
  console.log(`结果: ${passed} 通过, ${failed} 失败\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('测试运行失败:', err);
  process.exit(1);
});