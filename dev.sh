#!/bin/bash
# DeciFlow 开发服务器启动脚本
# 自动绕过代理，避免 localhost 访问问题

echo "🚀 启动 DeciFlow 开发服务器..."

# 临时取消代理环境变量（仅影响此脚本）
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY

echo "✅ 已禁用代理环境变量"
echo "📱 你的系统代理继续工作（浏览器等不受影响）"
echo ""
echo "正在启动 Vite 开发服务器..."
echo ""

cd "$(dirname "$0")"
npx vite --port 3000 --host 0.0.0.0
