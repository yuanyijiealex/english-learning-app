#!/bin/bash

echo "🚀 开始部署到生产环境..."

# 检查是否安装了必要的工具
check_requirements() {
    if ! command -v node &> /dev/null; then
        echo "❌ 请先安装 Node.js"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        echo "❌ 请先安装 Git"
        exit 1
    fi
}

# 构建项目
build_project() {
    echo "📦 构建项目..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败"
        exit 1
    fi
    echo "✅ 构建成功"
}

# 部署到Vercel
deploy_vercel() {
    echo "☁️ 部署到 Vercel..."

    if ! command -v vercel &> /dev/null; then
        echo "📥 安装 Vercel CLI..."
        npm i -g vercel
    fi

    echo "🔑 请登录 Vercel（如果需要）"
    vercel --prod

    echo "✅ 部署完成！"
}

# 部署到Netlify
deploy_netlify() {
    echo "☁️ 部署到 Netlify..."

    if ! command -v netlify &> /dev/null; then
        echo "📥 安装 Netlify CLI..."
        npm i -g netlify-cli
    fi

    netlify deploy --prod --dir=.next

    echo "✅ 部署完成！"
}

# 主菜单
main() {
    check_requirements

    echo "选择部署平台："
    echo "1) Vercel（推荐）"
    echo "2) Netlify"
    echo "3) 仅构建"
    read -p "请选择 (1-3): " choice

    case $choice in
        1)
            build_project
            deploy_vercel
            ;;
        2)
            build_project
            deploy_netlify
            ;;
        3)
            build_project
            ;;
        *)
            echo "无效选择"
            exit 1
            ;;
    esac

    echo "🎉 所有操作完成！"
}

main