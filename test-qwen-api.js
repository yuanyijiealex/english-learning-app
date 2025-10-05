// 测试通义千问API是否正常工作
// 使用方法：
// 1. 把下面的 'sk-你的密钥' 替换成你刚生成的密钥
// 2. 运行：node test-qwen-api.js

const API_KEY = 'sk-你的密钥'  // 👈 在这里粘贴你的密钥

async function testAPI() {
  console.log('=====================================')
  console.log('🔍 正在测试通义千问 API...')
  console.log('=====================================\n')

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',  // 👈 这里指定使用 qwen-turbo 模型
        input: {
          messages: [
            {
              role: 'system',
              content: '你是一个英语学习助手'
            },
            {
              role: 'user',
              content: '请用中英文介绍一下 "Hello World" 这个短语'
            }
          ]
        },
        parameters: {
          result_format: 'message',
          temperature: 0.7
        }
      })
    })

    const responseText = await response.text()

    if (!response.ok) {
      console.error('❌ API调用失败!')
      console.error('状态码:', response.status)
      console.error('错误信息:', responseText)
      console.log('\n可能的原因：')
      console.log('1. API密钥不正确（检查是否完整复制）')
      console.log('2. 模型未开通（去控制台确认 qwen-turbo 已开通）')
      console.log('3. 网络问题（检查网络连接）')
      return
    }

    const data = JSON.parse(responseText)

    console.log('✅ API调用成功！\n')
    console.log('📊 调用信息：')
    console.log('   - 使用模型: qwen-turbo')
    console.log('   - 请求ID:', data.request_id)
    console.log('')
    console.log('💬 AI回复：')
    console.log('-----------------------------------')
    console.log(data.output.choices[0].message.content)
    console.log('-----------------------------------\n')

    const totalTokens = data.usage.input_tokens + data.usage.output_tokens
    const cost = totalTokens * 0.000002  // qwen-turbo: ¥2/百万tokens

    console.log('📈 使用统计：')
    console.log('   - 输入Tokens:', data.usage.input_tokens)
    console.log('   - 输出Tokens:', data.usage.output_tokens)
    console.log('   - 总计Tokens:', totalTokens)
    console.log('   - 预估成本: ¥', cost.toFixed(6))
    console.log('')
    console.log('🎉 恭喜！你的API配置正确，可以开始使用了！')
    console.log('')
    console.log('下一步：')
    console.log('1. 把这个密钥配置到 .env.local 文件：')
    console.log(`   QWEN_API_KEY=${API_KEY}`)
    console.log('2. 重启开发服务器')
    console.log('3. 测试AI功能')

  } catch (error) {
    console.error('❌ 发生错误:', error.message)
    console.log('\n请检查：')
    console.log('1. 是否正确替换了API密钥')
    console.log('2. 网络是否正常')
    console.log('3. Node.js版本是否支持fetch（需要18+）')
  }
}

// 检查是否已经替换密钥
if (API_KEY === 'sk-你的密钥') {
  console.log('⚠️  请先替换 API_KEY 为你的实际密钥！')
  console.log('   编辑这个文件的第6行，把 "sk-你的密钥" 替换成你刚生成的密钥')
  process.exit(1)
}

// 运行测试
console.log('🚀 开始测试...\n')
testAPI()