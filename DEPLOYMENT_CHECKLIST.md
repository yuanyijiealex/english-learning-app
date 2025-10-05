# 🚀 部署清单 - Scene English

## 📅 时间线：2-3天完成上线

### ✅ Day 1（今天）- 基础准备

#### 账号注册（1小时）
- [ ] GitHub账号（已有请跳过）
- [ ] Vercel账号：https://vercel.com
- [ ] Supabase账号：https://supabase.com
- [ ] 阿里云通义千问API（可选）：https://dashscope.console.aliyun.com

#### Supabase配置（30分钟）
- [ ] 创建新项目（选择Singapore区域）
- [ ] 执行 `supabase/init.sql` 创建数据库表
- [ ] 记录以下信息：
  - Project URL: _________________
  - Anon Key: _________________
  - Service Key: _________________

#### 环境变量配置（30分钟）
- [ ] 复制 `.env.production.example` 为 `.env.production`
- [ ] 填入Supabase连接信息
- [ ] 配置应用URL（暂时使用Vercel分配的域名）

#### 代码准备（1小时）
- [ ] 确保代码已推送到GitHub
- [ ] 移除所有console.log
- [ ] 检查敏感信息是否已移除
- [ ] 确保.gitignore包含所有环境文件

---

### ✅ Day 2 - 部署与测试

#### 本地测试（30分钟）
```bash
# 1. 设置生产环境变量
cp .env.production.example .env.production
# 编辑填入实际值

# 2. 构建测试
npm run build

# 3. 本地运行生产版本
npm run start
# 访问 http://localhost:3000
```

- [ ] 登录功能正常
- [ ] 视频播放正常
- [ ] 数据保存正常
- [ ] 页面加载速度 <3秒

#### Vercel部署（30分钟）

**方式1：GitHub自动部署（推荐）**
1. 登录Vercel
2. 点击"New Project"
3. 导入GitHub仓库
4. 配置环境变量（复制.env.production内容）
5. 点击Deploy

**方式2：命令行部署**
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

- [ ] 部署成功
- [ ] 获得访问URL：https://xxxxx.vercel.app
- [ ] 基础功能测试通过

#### 环境变量设置（Vercel后台）
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_KEY
- [ ] QWEN_API_KEY（如果需要AI功能）

---

### ✅ Day 3 - 优化与发布

#### 性能优化（可选）
- [ ] 图片使用next/image优化
- [ ] 启用代码分割
- [ ] 配置CDN（七牛云免费10GB）

#### 域名配置（可选但推荐）
- [ ] 购买域名（阿里云/腾讯云，约55元/年）
- [ ] 在Vercel添加自定义域名
- [ ] DNS解析（CNAME记录）
- [ ] 等待SSL证书自动配置

#### 监控设置（推荐）
- [ ] Google Analytics（免费）
  ```javascript
  // 在 app/layout.tsx 添加
  <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX" />
  ```
- [ ] Sentry错误监控（免费5000事件/月）

#### 最终检查
- [ ] 所有页面可访问
- [ ] 移动端显示正常
- [ ] 登录/注册功能正常
- [ ] 数据增删改查正常
- [ ] 404页面配置

---

## 🎯 快速命令参考

### 构建与测试
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 检查TypeScript错误
npx tsc --noEmit
```

### Vercel部署
```bash
# 首次部署
vercel

# 生产部署
vercel --prod

# 查看部署日志
vercel logs

# 设置环境变量
vercel env add VARIABLE_NAME
```

### 问题排查
```bash
# 查看构建日志
vercel logs --output

# 检查函数日志
vercel logs [function-name]

# 本地模拟Vercel环境
vercel dev
```

---

## 💰 成本控制

### 当前配置成本（月度）
| 服务 | 提供商 | 成本 | 状态 |
|------|--------|------|------|
| 托管 | Vercel免费版 | ￥0 | ✅ |
| 数据库 | Supabase免费版 | ￥0 | ✅ |
| CDN | Vercel内置 | ￥0 | ✅ |
| SSL证书 | Vercel自动 | ￥0 | ✅ |
| **总计** | | **￥0** | |

### 可选升级（需要时再加）
- 自定义域名：￥55/年
- AI API（通义千问）：约￥50/月
- 视频存储（七牛云）：10GB免费
- Vercel Pro（更多资源）：￥140/月

---

## 🚨 常见问题解决

### 1. 构建失败
```bash
# 清除缓存重新构建
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### 2. 环境变量不生效
- 确保在Vercel后台正确设置
- 重新部署：`vercel --prod --force`

### 3. Supabase连接失败
- 检查防火墙设置
- 确认API密钥正确
- 查看Supabase项目状态

### 4. 部署后白屏
- 检查浏览器控制台错误
- 查看Vercel函数日志
- 确认环境变量配置

---

## 📞 获取帮助

- Vercel文档：https://vercel.com/docs
- Supabase文档：https://supabase.com/docs
- Next.js文档：https://nextjs.org/docs
- 项目Issue：在GitHub创建Issue

---

## ✨ 恭喜！

完成以上步骤后，你的英语学习平台就正式上线了！
访问地址：https://your-app.vercel.app

记住：**先上线，再优化**。有了真实用户反馈后再逐步改进。