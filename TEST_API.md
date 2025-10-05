# 🎯 通义千问API配置与测试指南

## 理解API密钥与模型的关系

### 📌 核心概念
- **API密钥**：是你的"通行证"，用于身份验证
- **模型选择**：在代码中指定，不是在密钥中决定的

```
API密钥（sk-xxxxx） + 代码中指定模型 = 实际调用
```

## 🔧 我们项目的模型配置

### 当前默认配置
```javascript
// src/lib/ai/qwen.ts 第33行
this.model = config.model || 'qwen-turbo'  // 默认使用 qwen-turbo
```

### 可用模型列表
| 模型名称 | 代码中的值 | 价格 | 特点 |
|---------|-----------|------|------|
| 通义千问-Turbo | `qwen-turbo` | ¥2/百万tokens | 最快最便宜 ✅当前使用 |
| 通义千问-Plus | `qwen-plus` | ¥8/百万tokens | 效果更好 |
| 通义千问-Max | `qwen-max` | ¥20/百万tokens | 效果最好 |

## 📝 立即测试你的API

### 步骤1：配置密钥
编辑 `.env.local` 文件：
```env
AI_PROVIDER=qwen
QWEN_API_KEY=sk-你刚才生成的密钥
```

### 步骤2：创建测试脚本
创建文件 `test-api.js`：
```javascript
// test-api.js
const API_KEY = 'sk-你的密钥'

async function testAPI() {
  console.log('🔍 测试通义千问API...\n')

  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-turbo',  // 👈 这里指定模型
      input: {
        messages: [
          {
            role: 'user',
            content: '用10个字介绍自己'
          }
        ]
      },
      parameters: {
        result_format: 'message'
      }
    })
  })

  if (!response.ok) {
    console.error('❌ API调用失败:', response.status, response.statusText)
    const error = await response.text()
    console.error(error)
    return
  }

  const data = await response.json()
  console.log('✅ API调用成功！')
  console.log('📊 使用模型:', 'qwen-turbo')
  console.log('💬 AI回复:', data.output.choices[0].message.content)
  console.log('📈 Token使用:', data.usage.input_tokens + data.usage.output_tokens, 'tokens')
  console.log('💰 预估成本: ¥', ((data.usage.input_tokens + data.usage.output_tokens) * 0.000002).toFixed(6))
}

testAPI()
```

### 步骤3：运行测试
```bash
node test-api.js
```

### 期望输出
```
🔍 测试通义千问API...

✅ API调用成功！
📊 使用模型: qwen-turbo
💬 AI回复: 我是通义千问，AI助手。
📈 Token使用: 25 tokens
💰 预估成本: ¥ 0.000050
```

## 🔄 切换不同模型

### 方法1：修改默认模型
编辑 `src/lib/ai/qwen.ts` 第33行：
```javascript
// 便宜快速版
this.model = config.model || 'qwen-turbo'

// 效果更好版
this.model = config.model || 'qwen-plus'

// 最强版本
this.model = config.model || 'qwen-max'
```

### 方法2：环境变量控制
添加到 `.env.local`：
```env
QWEN_MODEL=qwen-turbo  # 或 qwen-plus, qwen-max
```

然后修改代码：
```javascript
this.model = config.model || process.env.QWEN_MODEL || 'qwen-turbo'
```

## ❓ 常见问题

### Q: 如何确认正在使用哪个模型？
A: 查看控制台日志，我们的代码会输出：
```
Analysis completed using qwen, model: qwen-turbo
```

### Q: API密钥无效？
检查：
1. 密钥是否完整复制（包括 sk- 前缀）
2. 是否有多余空格
3. 是否已经开通模型服务

### Q: 想测试不同模型的效果？
```javascript
// 在 test-api.js 中修改这一行
model: 'qwen-plus',  // 改成你想测试的模型
```

### Q: 额度用完了？
- 查看控制台：https://dashscope.console.aliyun.com/
- 点击"资源包管理"查看剩余额度

## 🚀 下一步

1. ✅ 确认API测试成功
2. ✅ 重启开发服务器
3. ✅ 访问 http://localhost:3000
4. ✅ 测试AI闯关功能

---

💡 **提示**：qwen-turbo 对于英语学习场景完全够用，不需要更贵的模型！