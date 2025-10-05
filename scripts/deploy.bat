@echo off
echo 🚀 开始部署到生产环境...

:menu
echo.
echo 选择部署平台：
echo 1) Vercel（推荐）
echo 2) 本地构建测试
echo 3) 退出
echo.
set /p choice=请选择 (1-3):

if %choice%==1 goto vercel
if %choice%==2 goto build
if %choice%==3 goto end
goto menu

:build
echo.
echo 📦 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    goto end
)
echo ✅ 构建成功
echo.
echo 测试生产版本...
call npm run start
goto end

:vercel
echo.
echo 📦 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    goto end
)

echo.
echo ☁️ 部署到 Vercel...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📥 安装 Vercel CLI...
    call npm i -g vercel
)

echo.
echo 🔑 开始部署（请按提示操作）
call vercel --prod

echo.
echo ✅ 部署完成！
pause
goto end

:end
echo 👋 再见！