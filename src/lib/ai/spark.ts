// 讯飞星火 API 集成 - 专注教育场景
import crypto from 'crypto'
import WebSocket from 'ws'

interface SparkConfig {
  appId: string
  apiKey: string
  apiSecret: string
  version?: string
}

interface SparkMessage {
  role: string
  content: string
}

export class SparkClient {
  private appId: string
  private apiKey: string
  private apiSecret: string
  private version: string
  private wsUrl: string

  constructor(config: SparkConfig) {
    this.appId = config.appId
    this.apiKey = config.apiKey
    this.apiSecret = config.apiSecret
    this.version = config.version || 'v3.5'
    this.wsUrl = this.getWebSocketUrl()
  }

  private getWebSocketUrl(): string {
    const host = 'spark-api.xf-yun.com'
    const path = `/v3.5/chat`
    const date = new Date().toUTCString()

    // 生成签名
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
    const signatureSha = crypto
      .createHmac('sha256', this.apiSecret)
      .update(signatureOrigin)
      .digest()
    const signature = signatureSha.toString('base64')

    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    const authorization = Buffer.from(authorizationOrigin).toString('base64')

    return `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`
  }

  // 生成闯关题目的专用方法
  async generateQuizQuestions(
    videoContent: string,
    timePercent: number,
    questionType: 'scene' | 'vocabulary' | 'grammar'
  ): Promise<any> {
    const typeMap = {
      'scene': '场景理解题',
      'vocabulary': '词汇题',
      'grammar': '语法题'
    }

    const prompt = `你是一位经验丰富的英语教师，专门为中国学生设计有趣的学习题目。

视频内容片段：
${videoContent}

请生成1道${typeMap[questionType]}，要求：
1. 符合中国学生的认知习惯
2. 难度适中，有教育意义
3. 选项要有迷惑性但合理
4. 解释要详细且易懂

返回JSON格式：
{
  "id": "唯一ID",
  "time_percent": ${timePercent},
  "type": "${questionType}",
  "question": "题目内容",
  "options": ["选项1", "选项2", "选项3"],
  "correct_answer": 正确答案索引(0-2),
  "explanation": "详细解释",
  "ai_hint": "给学生的小提示",
  "points": 分值(10-30)
}`

    return this.sendMessage(prompt)
  }

  private sendMessage(content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl)
      let result = ''

      ws.on('open', () => {
        const params = {
          header: {
            app_id: this.appId,
            uid: Math.random().toString(36).substring(7)
          },
          parameter: {
            chat: {
              domain: 'generalv3.5',
              temperature: 0.5,
              max_tokens: 1024
            }
          },
          payload: {
            message: {
              text: [
                {
                  role: 'user',
                  content: content
                }
              ]
            }
          }
        }
        ws.send(JSON.stringify(params))
      })

      ws.on('message', (data) => {
        const response = JSON.parse(data.toString())
        if (response.header.code !== 0) {
          reject(new Error(`Spark API error: ${response.header.message}`))
          return
        }

        result += response.payload.choices.text[0].content

        if (response.header.status === 2) {
          ws.close()
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            resolve(result)
          }
        }
      })

      ws.on('error', (error) => {
        reject(error)
      })
    })
  }

  // 语音转写功能（替代Whisper）
  async transcribeAudio(audioBuffer: ArrayBuffer): Promise<{
    transcript_en: any[]
    transcript_cn: any[]
  }> {
    // 讯飞的语音转写API
    const formData = new FormData()
    formData.append('audio', new Blob([audioBuffer]))
    formData.append('language', 'en-US,zh-CN')

    const response = await fetch('https://api.xf-yun.com/v1/service/v1/iat', {
      method: 'POST',
      headers: {
        'X-Appid': this.appId,
        'X-ApiKey': this.apiKey,
      },
      body: formData
    })

    const result = await response.json()

    // 格式化返回结果
    return {
      transcript_en: result.english_segments || [],
      transcript_cn: result.chinese_segments || []
    }
  }
}

// 导出单例
export const sparkClient = new SparkClient({
  appId: process.env.SPARK_APP_ID || '',
  apiKey: process.env.SPARK_API_KEY || '',
  apiSecret: process.env.SPARK_API_SECRET || ''
})