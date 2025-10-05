# 🔐 安全配置API密钥指南

## ⚠️ 安全警告
**永远不要分享你的API密钥给任何人，包括：**
- ❌ 不要发给AI助手（包括我）
- ❌ 不要提交到Git仓库
- ❌ 不要发到群聊或论坛
- ❌ 不要写在公开文档

## ✅ 安全配置步骤

### 方法一：使用记事本（推荐新手）

1. **打开文件**
   ```bash
   # Windows用户
   notepad .env.local

   # 或者直接双击打开 .env.local 文件
   ```

2. **找到这一行**
   ```
   QWEN_API_KEY=your_qwen_api_key
   ```

3. **替换成你的密钥**
   ```
   QWEN_API_KEY=sk-你的实际密钥
   ```

4. **保存文件**
   - Ctrl+S 保存
   - 关闭记事本

### 方法二：使用VSCode（如果你有）

1. 在VSCode中打开项目
2. 点击左侧 `.env.local` 文件
3. 修改 `QWEN_API_KEY=` 后面的值
4. Ctrl+S 保存

### 方法三：命令行方式（高级用户）

```bash
# Windows PowerShell
$content = Get-Content .env.local
$content = $content -replace 'QWEN_API_KEY=.*', 'QWEN_API_KEY=sk-你的密钥'
Set-Content .env.local $content
```

## 🔍 验证配置是否成功

### 1. 测试密钥（不会泄露密钥）
```bash
node test-qwen-api.js
```

成功会显示：
```
✅ API调用成功！
```

### 2. 检查应用
- 重启开发服务器
- 访问 http://localhost:3000
- 测试AI功能

## 🛡️ 最佳安全实践

### 1. 使用环境变量
✅ 正确：密钥放在 `.env.local`
❌ 错误：密钥写在代码里

### 2. 添加到 .gitignore
确保 `.gitignore` 包含：
```
.env.local
.env
```

### 3. 定期更换密钥
- 每3-6个月更换一次
- 如果怀疑泄露，立即更换

### 4. 设置用量告警
在阿里云控制台设置：
- 日限额：¥10
- 月限额：¥100
- 异常用量短信提醒

## ❓ 常见问题

### Q: 不小心把密钥发给别人了怎么办？
A: 立即到阿里云控制台：
1. 删除旧密钥
2. 生成新密钥
3. 更新项目配置

### Q: 怎么知道密钥有没有被盗用？
A: 查看控制台的用量统计：
- https://dashscope.console.aliyun.com/
- 检查是否有异常调用

### Q: 生产环境怎么管理密钥？
A: 使用专门的密钥管理服务：
- 阿里云KMS
- 环境变量服务
- CI/CD密钥管理

## 📞 需要帮助？

如果配置遇到问题，告诉我：
- ✅ 错误信息（不含密钥）
- ✅ 操作步骤
- ❌ 不要发送密钥本身

记住：**保护API密钥就是保护你的钱包！** 💰