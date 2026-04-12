#!/bin/bash
# DeciFlow Electron 应用启动脚本

echo "🚀 启动 DeciFlow Electron 应用..."

# 临时取消代理环境变量（避免 localhost 访问问题）
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY

echo "✅ 已禁用代理环境变量"
echo ""

# 进入项目目录
cd /Users/terry/data-insight-pro

# 编译 main 进程
echo "📦 编译主进程..."
tsc -p tsconfig.main.json

if [ $? -ne 0 ]; then
  echo "❌ 主进程编译失败"
  exit 1
fi

echo "✅ 主进程编译成功"
echo ""

# 启动 Electron
echo "🔥 启动 Electron 应用..."
npx electron .
