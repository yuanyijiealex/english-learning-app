// 统一的AI服务接口 - 支持多个AI提供商
import { qwenClient } from '@/lib/ai/qwen'
import { sparkClient } from '@/lib/ai/spark'
import OpenAI from 'openai'

export interface VideoAnalysisResult {
  ai_analysis: {
    keywords: Array<{
      word: string
      translation: string
      frequency: number
      usage_context: string
      difficulty: 'easy' | 'medium' | 'hard'
    }>
    phrases: Array<{
      phrase: string
      translation: string
      usage_example: string
      formal_level: 'casual' | 'neutral' | 'formal'
    }>
    scenarios: string[]
    difficulty_score: number
    summary: string
  }
  checkpoints: Array<{
    id: string
    time_percent: number
    type: 'scene' | 'vocabulary' | 'grammar'
    question: string
    options: string[]
    correct_answer: number
    explanation: string
    ai_hint?: string
    points: number
  }>
}

class UnifiedAIService {
  private provider: string
  private openai?: OpenAI

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'qwen'

    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
  }

  // 分析视频内容
  async analyzeVideoContent(
    transcript_en: any[],
    transcript_cn: any[],
    title: string
  ): Promise<VideoAnalysisResult> {
    console.log(`Using AI provider: ${this.provider}`)

    try {
      switch (this.provider) {
        case 'qwen':
          return await this.analyzeWithQwen(transcript_en, transcript_cn, title)

        case 'spark':
          return await this.analyzeWithSpark(transcript_en, transcript_cn, title)

        case 'openai':
          return await this.analyzeWithOpenAI(transcript_en, transcript_cn, title)

        default:
          // 默认使用通义千问
          return await this.analyzeWithQwen(transcript_en, transcript_cn, title)
      }
    } catch (error) {
      console.error(`${this.provider} failed, falling back to Qwen...`, error)
      // 降级策略：失败时自动切换到通义千问
      if (this.provider !== 'qwen') {
        return await this.analyzeWithQwen(transcript_en, transcript_cn, title)
      }
      throw error
    }
  }

  // 使用通义千问分析
  private async analyzeWithQwen(
    transcript_en: any[],
    transcript_cn: any[],
    title: string
  ): Promise<VideoAnalysisResult> {
    const result = await qwenClient.analyzeVideoContent(
      JSON.stringify(transcript_en),
      JSON.stringify(transcript_cn),
      title
    )

    // 生成闯关题目
    const checkpoints = await this.generateCheckpoints(transcript_en, title)

    return {
      ai_analysis: {
        keywords: result.keywords || [],
        phrases: result.phrases || [],
        scenarios: result.scenarios || [],
        difficulty_score: result.difficulty_score || 3,
        summary: result.summary || '这是一段关于日常英语对话的学习视频'
      },
      checkpoints
    }
  }

  // 使用讯飞星火分析（专注教育场景）
  private async analyzeWithSpark(
    transcript_en: any[],
    transcript_cn: any[],
    title: string
  ): Promise<VideoAnalysisResult> {
    // 讯飞星火特别擅长生成教育内容
    const checkpoints = []

    for (const percent of [30, 60, 90]) {
      const type = percent === 30 ? 'vocabulary' : percent === 60 ? 'grammar' : 'scene'
      const quiz = await sparkClient.generateQuizQuestions(
        JSON.stringify(transcript_en),
        percent,
        type as any
      )
      checkpoints.push(quiz)
    }

    // 基础分析使用通义千问（成本考虑）
    const analysis = await qwenClient.analyzeVideoContent(
      JSON.stringify(transcript_en),
      JSON.stringify(transcript_cn),
      title
    )

    return {
      ai_analysis: {
        keywords: analysis.keywords || [],
        phrases: analysis.phrases || [],
        scenarios: analysis.scenarios || [],
        difficulty_score: analysis.difficulty_score || 3,
        summary: analysis.summary || '这是一段英语学习视频'
      },
      checkpoints
    }
  }

  // 使用OpenAI分析
  private async analyzeWithOpenAI(
    transcript_en: any[],
    transcript_cn: any[],
    title: string
  ): Promise<VideoAnalysisResult> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
Analyze this English learning video for Chinese students.

Title: ${title}
English subtitles: ${JSON.stringify(transcript_en)}
Chinese subtitles: ${JSON.stringify(transcript_cn)}

Return a JSON object with:
1. keywords (5-10 important words with translation, frequency, usage_context, difficulty)
2. phrases (3-5 key phrases with translation, usage_example, formal_level)
3. scenarios (3-5 scene tags)
4. difficulty_score (1-5)
5. summary (50 words)
6. 3 quiz checkpoints at 30%, 60%, 90% progress
`

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an English teaching assistant for Chinese students.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      ai_analysis: {
        keywords: result.keywords || [],
        phrases: result.phrases || [],
        scenarios: result.scenarios || [],
        difficulty_score: result.difficulty_score || 3,
        summary: result.summary || ''
      },
      checkpoints: result.checkpoints || []
    }
  }

  // 生成闯关题目（通用方法）
  private async generateCheckpoints(transcript: any[], title: string) {
    const checkpoints = []
    const timePoints = [30, 60, 90]
    const types = ['vocabulary', 'grammar', 'scene']

    for (let i = 0; i < 3; i++) {
      checkpoints.push({
        id: `cp${i + 1}`,
        time_percent: timePoints[i],
        type: types[i] as 'vocabulary' | 'grammar' | 'scene',
        question: this.generateQuestion(types[i], transcript),
        options: this.generateOptions(types[i]),
        correct_answer: Math.floor(Math.random() * 3),
        explanation: '这是AI生成的解释，帮助你更好地理解',
        ai_hint: '注意上下文语境',
        points: 20
      })
    }

    return checkpoints
  }

  private generateQuestion(type: string, transcript: any[]): string {
    const questions: Record<string, string> = {
      vocabulary: '这个单词在视频中的意思是什么？',
      grammar: '这个句子使用了什么语法结构？',
      scene: '这段对话发生在什么场景？'
    }
    return questions[type] || '请选择正确答案'
  }

  private generateOptions(type: string): string[] {
    const optionSets: Record<string, string[]> = {
      vocabulary: ['日常用语', '正式用语', '俚语表达'],
      grammar: ['现在进行时', '一般现在时', '现在完成时'],
      scene: ['办公室对话', '餐厅点餐', '街头问路']
    }
    return optionSets[type] || ['选项A', '选项B', '选项C']
  }

  // 语音转文字
  async transcribeAudio(audioBuffer: ArrayBuffer): Promise<{
    transcript_en: any[]
    transcript_cn: any[]
    duration: number
  }> {
    if (this.provider === 'spark') {
      // 使用讯飞语音识别
      const result = await sparkClient.transcribeAudio(audioBuffer)
      return {
        ...result,
        duration: 180 // 默认时长
      }
    } else if (this.openai) {
      // 使用Whisper
      const audioBlob = new Blob([audioBuffer])
      const file = new File([audioBlob], 'audio.mp3')

      const transcription = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'en',
        response_format: 'verbose_json'
      })

      return {
        transcript_en: transcription.segments || [],
        transcript_cn: [], // 需要额外翻译
        duration: Math.round(transcription.duration || 0)
      }
    } else {
      // 返回模拟数据
      return {
        transcript_en: [{ start: 0, end: 3, text: "Sample text" }],
        transcript_cn: [{ start: 0, end: 3, text: "示例文本" }],
        duration: 180
      }
    }
  }

  // 获取当前使用的AI提供商
  getProvider(): string {
    return this.provider
  }

  // 动态切换AI提供商
  setProvider(provider: string): void {
    this.provider = provider
    console.log(`Switched to AI provider: ${provider}`)
  }

  // 获取成本估算
  estimateCost(tokensUsed: number): { provider: string, cost: number, currency: string } {
    const costs: Record<string, { rate: number, currency: string }> = {
      qwen: { rate: 0.002, currency: 'CNY' },      // ¥2/M tokens
      spark: { rate: 0.010, currency: 'CNY' },      // ¥10/M tokens
      openai: { rate: 0.002, currency: 'USD' }      // $2/M tokens
    }

    const providerCost = costs[this.provider] || costs.qwen
    const totalCost = (tokensUsed / 1000000) * providerCost.rate

    return {
      provider: this.provider,
      cost: totalCost,
      currency: providerCost.currency
    }
  }
}

// 导出单例
export const aiService = new UnifiedAIService()

// 导出类型
export type { UnifiedAIService }