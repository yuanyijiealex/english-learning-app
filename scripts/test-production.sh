#!/bin/bash

echo "🔍 开始生产环境测试..."

# 1. 检查环境变量
echo "📋 检查环境变量配置..."
if [ ! -f .env.production ]; then
    echo "❌ 缺少 .env.production 文件"
    echo "请复制 .env.production.example 并填入实际值"
    exit 1
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm ci

# 3. 构建项目
echo "🔨 构建生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误"
    exit 1
fi

# 4. 启动生产服务器
echo "🚀 启动生产服务器..."
echo "访问 http://localhost:3000 进行测试"
npm run start