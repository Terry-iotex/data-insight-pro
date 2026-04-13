# DeciFlow 应用发布指南

## 📋 概览

DeciFlow 支持发布到以下平台：

| 平台 | 状态 | 费用 | 审核时间 |
|------|------|------|----------|
| Mac App Store | ✅ 支持 | $99/年 | 1-3 天 |
| Microsoft Store | ✅ 支持 | $19 (一次性) | 1-3 天 |
| 直接分发 | ✅ 支持 | GitHub 免费 | 即时 |

---

## 🍎 Mac App Store 发布流程

### 1. 准备工作

#### 1.1 Apple Developer 账号
- 注册：https://developer.apple.com/programs/enroll/
- 费用：$99/年
- 需要：公司营业执照或个人身份验证

#### 1.2 证书配置

在 Xcode 或 Apple Developer 后台创建以下证书：

```
1. Mac App Store Distribution 证书
2. Mac Installer Distribution 证书
3. Developer ID Application 证书（用于非 MAS 分发）
```

下载证书并安装到钥匙串。

#### 1.3 Provisioning Profile

1. 登录 Apple Developer 后台
2. 创建 App ID：`com.datainsight.pro`
3. 创建 Mac App Store Provisioning Profile
4. 下载并保存到 `resources/embedded.provisionprofile`

### 2. 构建配置

#### 2.1 环境变量

创建 `.env` 或在 CI/CD 中设置：

```bash
# Apple ID for notarization
APPLE_ID=your-apple-id@email.com
# App-specific password (generate at appleid.apple.com)
APPLE_ID_PASSWORD=xxxx-xxxx-xxxx-xxxx
# Team ID (found in Apple Developer account)
APPLE_TEAM_ID=XXXXXXXXXX
```

#### 2.2 构建命令

```bash
# 构建 Mac App Store 版本
npm run dist:mas

# 构建 Mac App Store 开发版本
npm run dist:mas-dev
```

### 3. 上传到 App Store Connect

#### 3.1 传输工具

```bash
# 使用 Transporter 上传
# 或使用 xcrun 命令
xcrun altool --upload-app \
  --type osx \
  --file release/DeciFlow-1.0.0-mas.pkg \
  --username "your-apple-id@email.com" \
  --password "app-specific-password"
```

#### 3.2 App Store Connect 配置

登录 https://appstoreconnect.apple.com/：

1. **创建应用**
   - 选择「平台」→「Mac」
   - 填写基本信息（名称、副标题等）

2. **填写应用信息**
   - 名称：DeciFlow
   - 副标题：AI 驱动的数据分析工具
   - 类别：Developer Tools
   - 版权：Terry

3. **上传截图**
   - 需要以下尺寸：
     - 1280x800 (Mac)
     - 1440x900 (Mac)
     - 2560x1600 (Mac Retina)
     - 2880x1800 (Mac Retina)

4. **填写描述和关键词**
   - 描述：清晰介绍产品功能
   - 关键词：数据分析, AI, SQL, 可视化

5. **提交审核**
   - 所有信息填写完成后提交
   - 审核时间：1-3 天

### 4. 审核注意事项

- ❌ 不要在应用中嵌入更新机制（Mac App Store 会处理）
- ✅ 确保应用遵守 Apple 审核指南
- ✅ 隐私政策需要完整
- ✅ 应用功能描述要准确

---

## 🪟 Microsoft Store 发布流程

### 1. 准备工作

#### 1.1 开发者账号

- 注册：https://developer.microsoft.com/store
- 费用：$19（一次性）
- 需要验证开发者身份

### 2. 应用打包

```bash
# 构建 Windows App Store 版本
npm run dist:win
```

需要额外配置 `appx` 目标：

```json
"win": {
  "target": ["appx"]
}
```

### 3. 提交流程

1. 登录 Partner Center：https://partner.microsoft.com/dashboard
2. 创建新应用
3. 上传 `.appxupload` 文件
4. 填写应用信息
5. 提交审核

---

## 📦 直接分发（推荐开始方式）

### GitHub Releases

适合开源项目或快速发布：

```bash
# 构建所有平台
npm run dist

# 发布到 GitHub
# 1. 在 GitHub 创建新 Release
# 2. 上传 release/ 目录下的安装包
```

### 自建网站下载

1. 构建：`npm run dist`
2. 上传到你的网站/CDN
3. 提供下载链接

---

## 📝 发布前检查清单

### 代码质量
- [ ] 所有功能正常工作
- [ ] 没有控制台错误
- [ ] 性能良好
- [ ] 内存使用合理

### 应用元数据
- [ ] 应用名称和描述
- [ ] 应用截图
- [ ] 应用图标
- [ ] 隐私政策
- [ ] 用户协议

### 安全性
- [ ] 代码签名
- [ ] 应用公证（macOS）
- [ ] 权限请求合理

### 文档
- [ ] 用户手册
- [ ] 更新日志
- [ ] 常见问题

---

## 🚀 快速开始

**最简单的发布方式（GitHub）：**

```bash
# 1. 构建应用
npm run dist

# 2. 到 GitHub 创建 Release
# 3. 上传 release/ 目录中的文件
# 4. 发布！
```

**发布到 Mac App Store（推荐长期）：**

```bash
# 1. 注册 Apple Developer 账号 ($99/年)
# 2. 配置证书和 Provisioning Profile
# 3. 构建 MAS 版本
npm run dist:mas

# 4. 上传到 App Store Connect
# 5. 填写应用信息
# 6. 提交审核
```

---

## 💰 费用对比

| 平台 | 费用 | 交易手续费 |
|------|------|-----------|
| Mac App Store | $99/年 | 30% (15% 续订) |
| Microsoft Store | $19 一次性 | 30% |
| 直接分发 | 免费 | 0% (支付平台 ~3%) |
| GitHub Sponsors | 免费 | 平台抽成 |

---

## 📞 需要帮助？

- Apple Developer 文档：https://developer.apple.com/documentation/
- Electron Builder 文档：https://www.electron.build/
- Microsoft Store 文档：https://docs.microsoft.com/en-us/windows/msix/
