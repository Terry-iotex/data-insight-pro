<div align="center">

![DeciFlow Logo](resources/icon-128x128.png)

# DeciFlow

**AI 驱动的数据分析工具，让数据洞察触手可及**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-41-9FEAF9)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6)](https://www.typescriptlang.org/)

</div>

---

## ✨ 功能特性

- **🤖 AI 智能分析** - 自然语言查询，自动生成 SQL，智能洞察发现
- **📊 丰富可视化** - 多种图表类型，一键切换，拖拽交互
- **🔌 多数据源支持** - PostgreSQL、MySQL、MongoDB 一键连接
- **📖 数据字典** - 统一管理业务指标和字段定义
- **🔒 安全可靠** - SQL 注入防护，数据脱敏，审计日志
- **🎨 精美设计** - 深色/浅色主题，响应式布局，流畅动画

---

## 🖼️ 界面预览

### 主界面
![Dashboard](screenshots/dashboard.png)

### AI 分析
![AI Analysis](screenshots/analysis.png)

### 数据可视化
![Charts](screenshots/charts.png)

---

## 📥 下载安装

### macOS

**支持 macOS 10.15+ (Intel & Apple Silicon M1/M2/M3)**

1. 下载 `DeciFlow-mac.dmg`
2. 打开 DMG 文件，将 DeciFlow 拖入「应用程序」文件夹
3. 首次打开时，右键点击 → 选择「打开」（绕过 Gatekeeper）

[**下载 macOS 版本**](https://github.com/Terry-iotex/data-insight-pro/releases/latest) →

---

### Windows

**支持 Windows 10/11 (64 位)**

1. 下载 `DeciFlow-winSetup.exe`
2. 运行安装程序，按提示完成安装
3. 启动 DeciFlow

[**下载 Windows 版本**](https://github.com/Terry-iotex/data-insight-pro/releases/latest) →

---

### 从源码运行

```bash
# 克隆仓库
git clone https://github.com/Terry-iotex/data-insight-pro.git
cd data-insight-pro

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建应用
npm run build
npm run dist
```

---

## 🚀 快速开始

### 1. 连接数据源

首次使用时，需要连接你的数据库：

1. 点击左侧「数据源」
2. 选择数据库类型（PostgreSQL / MySQL / MongoDB）
3. 填写连接信息
4. 点击「测试连接」
5. 连接成功后点击「保存」

### 2. 开始查询

在首页输入框中输入自然语言查询：

```
"查询过去30天的用户增长趋势"
"分析上周各渠道的转化率"
"找出销售额下降的原因"
```

### 3. 探索洞察

- **AI 洞察** - 自动发现数据中的模式和异常
- **可视化** - 一键生成图表，支持拖拽调整
- **导出** - 导出为 CSV、JSON 或图片

---

## 📚 使用文档

详细使用文档请访问：[Wiki](https://github.com/Terry-iotex/data-insight-pro/wiki)

---

## 🛠️ 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS
- **桌面**: Electron 41
- **图表**: Recharts
- **构建**: Vite + electron-builder
- **AI**: OpenAI / Claude / Gemini (可选)

---

## 🌟 Star History

如果这个项目对你有帮助，请给个 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Terry-iotex/data-insight-pro&type=Date)](https://star-history.com/#Terry-iotex/data-insight-pro&Date)

---

## 📄 许可证

[MIT License](LICENSE) - Terry

---

## 🙏 致谢

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Made with ❤️ by [Terry](https://github.com/Terry-iotex)**

[官网](https://datainsight.pro) · [文档](https://docs.datainsight.pro) · [反馈](https://github.com/Terry-iotex/data-insight-pro/issues)

</div>
