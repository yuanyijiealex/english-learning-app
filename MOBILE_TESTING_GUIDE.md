# 📱 移动端测试指南

## 方法一：局域网直接访问（推荐）

### 步骤：

1. **获取电脑IP地址**
```bash
# Windows
ipconfig
# 找到 IPv4 地址，例如：192.168.1.100
```

2. **启动开发服务器（允许外部访问）**
```bash
npm run dev:mobile
```

3. **手机访问**
- 确保手机和电脑在同一WiFi
- 手机浏览器输入：`http://[电脑IP]:3000`
- 例如：`http://192.168.1.100:3000`

## 方法二：使用内网穿透工具

### 使用 ngrok（全球访问）

1. **安装 ngrok**
```bash
# 下载地址：https://ngrok.com/download
# 或使用 npm
npm install -g ngrok
```

2. **启动本地服务**
```bash
npm run dev
```

3. **启动 ngrok**
```bash
ngrok http 3000
```

4. **获得公网地址**
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

5. **手机访问**
- 直接访问 ngrok 提供的 https 地址
- 可以分享给任何人测试

### 使用 localtunnel（简单快速）

1. **安装**
```bash
npm install -g localtunnel
```

2. **启动隧道**
```bash
lt --port 3000 --subdomain myapp
```

3. **访问地址**
```
https://myapp.loca.lt
```

## 方法三：使用 Vercel 预览部署

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **部署到预览环境**
```bash
vercel
# 按提示操作，会生成预览链接
```

3. **获得预览链接**
```
https://your-app-xxx.vercel.app
```

## 方法四：Chrome 远程调试

### Android 设备

1. **手机设置**
- 开启开发者模式
- 启用 USB 调试

2. **连接电脑**
- USB 连接手机和电脑
- Chrome 访问：`chrome://inspect`

3. **端口转发**
- 点击 Port forwarding
- 添加：`3000` -> `localhost:3000`

4. **手机访问**
- 直接访问：`http://localhost:3000`

### iOS 设备（使用 Safari）

1. **iPhone 设置**
- 设置 > Safari > 高级 > Web 检查器（开启）

2. **Mac Safari**
- 开发 > [你的iPhone] > 选择页面

## 方法五：使用开发工具模拟

### Chrome DevTools

1. **打开开发者工具**
- F12 或右键检查

2. **切换设备模式**
- Ctrl+Shift+M（Windows）
- Cmd+Shift+M（Mac）

3. **选择设备**
- 选择预设设备或自定义尺寸
- 可模拟触摸事件

### 响应式设计模式
- Firefox：Ctrl+Shift+M
- Edge：F12 后点击设备图标

## 🔧 常见问题

### 1. 无法访问
- 检查防火墙设置
- 确保在同一网络
- 使用 `dev:mobile` 命令

### 2. Windows 防火墙提示
- 允许 Node.js 通过防火墙
- 或临时关闭防火墙测试

### 3. 获取正确 IP
```bash
# Windows - 查看所有网络接口
ipconfig /all

# 找 "无线局域网适配器 WLAN" 或 "以太网适配器"
# IPv4 地址就是你需要的
```

### 4. 端口被占用
```bash
# 使用其他端口
next dev -p 3001
```

## 📱 测试要点

### 移动端测试清单
- [ ] 触摸交互正常
- [ ] 滑动手势流畅
- [ ] 视频播放正常
- [ ] 键盘弹出不遮挡
- [ ] 横竖屏切换
- [ ] 不同屏幕尺寸适配
- [ ] 加载速度
- [ ] 网络切换处理

### 推荐测试设备
- iPhone 12/13/14（标准尺寸）
- iPhone SE（小屏）
- iPhone Pro Max（大屏）
- Android 主流机型
- iPad/平板

## 🚀 快速开始

最简单的方法：
```bash
# 1. 启动支持外部访问的服务
npm run dev:mobile

# 2. 查看 IP
ipconfig

# 3. 手机访问
http://192.168.x.x:3000
```

## 💡 提示

- 局域网测试最稳定快速
- ngrok 适合远程测试和分享
- Vercel 预览适合接近生产环境测试
- Chrome DevTools 适合快速调试响应式

现在你可以随时在手机上测试，无需等待上线！