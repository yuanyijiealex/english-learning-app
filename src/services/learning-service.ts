// 学习进度服务 - 保存和同步用户学习数据
import { supabase } from '@/lib/supabase/client'

interface LearningProgress {
  videoId: string
  userId: string
  progress: number
  watchDuration: number
  pointsEarned: number
  checkpointsPassed: string[]
  wordsCollected: string[]
  completed: boolean
  lastWatchedAt: Date
}

class LearningService {
  private localStorageKey = 'learning_progress'
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    // 每30秒自动同步一次
    this.startAutoSync()
  }

  // 开始自动同步
  private startAutoSync() {
    if (typeof window !== 'undefined') {
      this.syncInterval = setInterval(() => {
        this.syncToCloud()
      }, 30000) // 30秒
    }
  }

  // 停止自动同步
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // 保存进度到本地
  async saveProgress(progress: Partial<LearningProgress>) {
    try {
      // 获取现有进度
      const existing = this.getLocalProgress()
      const videoKey = `video_${progress.videoId}`

      // 更新进度
      const updated = {
        ...existing[videoKey],
        ...progress,
        lastWatchedAt: new Date()
      }

      // 保存到本地
      existing[videoKey] = updated
      localStorage.setItem(this.localStorageKey, JSON.stringify(existing))

      // 尝试同步到云端
      this.syncToCloud()

      return updated
    } catch (error) {
      console.error('Failed to save progress:', error)
      return null
    }
  }

  // 获取本地进度
  getLocalProgress(): Record<string, any> {
    if (typeof window === 'undefined') return {}

    try {
      const saved = localStorage.getItem(this.localStorageKey)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  // 获取特定视频的进度
  getVideoProgress(videoId: string): LearningProgress | null {
    const all = this.getLocalProgress()
    return all[`video_${videoId}`] || null
  }

  // 同步到云端
  async syncToCloud() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return

      const localData = this.getLocalProgress()
      const records = Object.values(localData)

      // 批量更新到数据库
      for (const record of records) {
        if (record.videoId && record.progress !== undefined) {
          await supabase.from('learning_records').upsert({
            user_id: user.id,
            video_id: record.videoId,
            progress: record.progress,
            watch_duration: record.watchDuration || 0,
            points_earned: record.pointsEarned || 0,
            checkpoints_passed: record.checkpointsPassed || [],
            words_collected: record.wordsCollected || [],
            completed: record.completed || false,
            updated_at: new Date().toISOString()
          } as any)
        }
      }

      console.log('Progress synced to cloud')
    } catch (error) {
      console.error('Failed to sync to cloud:', error)
    }
  }

  // 从云端加载进度
  async loadFromCloud() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return

      const { data, error } = await supabase
        .from('learning_records')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      // 合并云端数据到本地
      const localData = this.getLocalProgress()
      data?.forEach((record: any) => {
        const key = `video_${record.video_id}`
        localData[key] = {
          videoId: record.video_id,
          userId: record.user_id,
          progress: record.progress,
          watchDuration: record.watched_duration,
          pointsEarned: record.points_earned || 0,
          checkpointsPassed: record.checkpoints_passed || [],
          wordsCollected: record.words_collected || [],
          completed: record.completed,
          lastWatchedAt: new Date(record.updated_at)
        }
      })

      localStorage.setItem(this.localStorageKey, JSON.stringify(localData))
      console.log('Progress loaded from cloud')
    } catch (error) {
      console.error('Failed to load from cloud:', error)
    }
  }

  // 获取当前用户
  private async getCurrentUser() {
    // 先检查演示用户
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      return JSON.parse(demoUser)
    }

    // 检查真实用户
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // 计算用户统计数据
  getUserStats() {
    const progress = this.getLocalProgress()
    const records = Object.values(progress)

    return {
      totalVideos: records.length,
      completedVideos: records.filter((r: any) => r.completed).length,
      totalPoints: records.reduce((sum: number, r: any) => sum + (r.pointsEarned || 0), 0),
      totalMinutes: records.reduce((sum: number, r: any) => sum + Math.floor((r.watchDuration || 0) / 60), 0),
      wordsLearned: [...new Set(records.flatMap((r: any) => r.wordsCollected || []))].length,
      checkpointsPassed: records.reduce((sum: number, r: any) => sum + (r.checkpointsPassed?.length || 0), 0)
    }
  }

  // 记录闯关完成
  async recordCheckpoint(videoId: string, checkpointId: string, points: number) {
    const progress = this.getVideoProgress(videoId) || {
      videoId,
      userId: 'current',
      progress: 0,
      watchDuration: 0,
      pointsEarned: 0,
      checkpointsPassed: [],
      wordsCollected: [],
      completed: false,
      lastWatchedAt: new Date()
    }

    // 避免重复记录
    if (!progress.checkpointsPassed.includes(checkpointId)) {
      progress.checkpointsPassed.push(checkpointId)
      progress.pointsEarned += points
    }

    return this.saveProgress(progress)
  }

  // 记录词汇收藏
  async collectWord(videoId: string, word: string) {
    const progress = this.getVideoProgress(videoId) || {
      videoId,
      userId: 'current',
      progress: 0,
      watchDuration: 0,
      pointsEarned: 0,
      checkpointsPassed: [],
      wordsCollected: [],
      completed: false,
      lastWatchedAt: new Date()
    }

    if (!progress.wordsCollected.includes(word)) {
      progress.wordsCollected.push(word)
    }

    return this.saveProgress(progress)
  }

  // 更新观看进度
  async updateWatchProgress(videoId: string, progress: number, duration: number) {
    const existing = this.getVideoProgress(videoId) || {
      videoId,
      userId: 'current',
      progress: 0,
      watchDuration: 0,
      pointsEarned: 0,
      checkpointsPassed: [],
      wordsCollected: [],
      completed: false,
      lastWatchedAt: new Date()
    }

    existing.progress = Math.max(existing.progress, progress)
    existing.watchDuration += duration
    existing.completed = progress >= 95 // 看到95%算完成

    return this.saveProgress(existing)
  }
}

// 导出单例
export const learningService = new LearningService()

// 导出类型
export type { LearningProgress }