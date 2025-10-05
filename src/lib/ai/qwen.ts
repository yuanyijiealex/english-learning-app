// 通义千问 API 集成
import crypto from 'crypto'

interface QwenConfig {
  apiKey: string
  model?: string
  baseUrl?: string
}

interface QwenMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface QwenResponse {
  output: {
    text: string
    finish_reason: string
  }
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class QwenClient {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor(config: QwenConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'qwen-turbo'
    this.baseUrl = config.baseUrl || 'https://dashscope.aliyuncs.com'
  }

  async createCompletion(messages: QwenMessage[], options?: {
    temperature?: number
    max_tokens?: number
    top_p?: number
  }): Promise<QwenResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/services/aigc/text-generation/generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: {
          messages
        },
        parameters: {
          temperature: options?.temperature || 0.7,
          max_tokens: options?.max_tokens || 2000,
          top_p: options?.top_p || 0.8,
          result_format: 'message'
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.statusText}`)
    }

    return await response.json()
  }

  // 视频内容分析专用方法
  async analyzeVideoContent(transcript_en: string, transcript_cn: string, title: string) {
    const messages: QwenMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的英语教学AI助手，专门为中国学习者设计英语学习内容。请用JSON格式返回分析结果。'
      },
      {
        role: 'user',
        content: `分析以下英语学习视频内容：

标题: ${title}
英文字幕: ${transcript_en}
中文字幕: ${transcript_cn}

请返回JSON格式的分析结果，包含：
1. keywords: 5-10个关键词（word, translation, frequency, usage_context, difficulty）
2. phrases: 3-5个重要短语（phrase, translation, usage_example, formal_level）
3. scenarios: 3-5个场景标签
4. difficulty_score: 难度评分(1-5)
5. summary: 50字内容总结`
      }
    ]

    const response = await this.createCompletion(messages, {
      temperature: 0.7,
      max_tokens: 1500
    })

    try {
      return JSON.parse(response.output.text)
    } catch (e) {
      console.error('Failed to parse Qwen response:', e)
      throw new Error('Invalid response format from Qwen')
    }
  }
}

// 导出单例
export const qwenClient = new QwenClient({
  apiKey: process.env.QWEN_API_KEY || ''
})