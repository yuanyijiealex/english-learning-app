export interface Video {
  id: string
  title: string
  url: string
  duration: number // 秒
  difficulty: 1 | 2 | 3 | 4 | 5
  category: string
  accent: 'US' | 'UK' | 'AU' | 'CA'
  thumbnail?: string
  transcript_en: Subtitle[]
  transcript_cn: Subtitle[]
  checkpoints: Checkpoint[]
  ai_analysis?: AIAnalysis
  view_count: number
  created_at: string
}

export interface Subtitle {
  start: number // 开始时间（秒）
  end: number // 结束时间（秒）
  text: string
}

export interface Checkpoint {
  id: string
  time_percent: number // 进度百分比 (30, 60, 90)
  type: 'scene' | 'vocabulary' | 'grammar'
  question: string
  options: string[]
  correct_answer: number // 正确答案索引
  explanation: string
  ai_hint?: string
  points: number // 奖励积分
}

export interface AIAnalysis {
  keywords: Keyword[]
  phrases: Phrase[]
  scenarios: string[]
  difficulty_score: number
  summary: string
}

export interface Keyword {
  word: string
  translation: string
  frequency: number
  usage_context: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Phrase {
  phrase: string
  translation: string
  usage_example: string
  formal_level: 'casual' | 'neutral' | 'formal'
}

export interface LearningRecord {
  id: string
  user_id: string
  video_id: string
  progress: number // 0-100
  watch_duration: number // 实际观看时长（秒）
  points_earned: number
  checkpoints_passed: string[]
  words_collected: string[]
  notes?: string
  completed: boolean
  updated_at: string
}