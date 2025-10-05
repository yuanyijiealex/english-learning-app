'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaBook, FaRedo, FaTrash, FaChartLine,
  FaFilter, FaCheckCircle, FaTimesCircle,
  FaBrain, FaLightbulb, FaCalendarAlt
} from 'react-icons/fa'
import QuizModal from '@/components/quiz/QuizModal'

interface Mistake {
  id: string
  videoId: string
  videoTitle: string
  question: string
  options: string[]
  correctAnswer: number
  userAnswer: number
  explanation?: string
  type: 'vocabulary' | 'grammar' | 'scenario'
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: string
  reviewCount: number
  lastReviewedAt?: string
  mastered: boolean
}

export default function MistakesPage() {
  const router = useRouter()
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [filteredMistakes, setFilteredMistakes] = useState<Mistake[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [showOnlyUnmastered, setShowOnlyUnmastered] = useState(true)
  const [selectedMistake, setSelectedMistake] = useState<Mistake | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'review' | 'difficulty'>('date')

  useEffect(() => {
    loadMistakes()
  }, [])

  useEffect(() => {
    filterMistakes()
  }, [mistakes, selectedType, selectedDifficulty, showOnlyUnmastered, sortBy])

  const loadMistakes = () => {
    // 模拟错题数据
    const mockMistakes: Mistake[] = [
      {
        id: '1',
        videoId: 'v1',
        videoTitle: '咖啡店对话',
        question: 'What does "Can I get you anything else?" mean?',
        options: [
          '我能为您点餐吗？',
          '您还需要其他什么吗？',
          '请问您要什么？',
          '这是您的账单'
        ],
        correctAnswer: 1,
        userAnswer: 0,
        explanation: 'This phrase is commonly used by service staff to ask if customers need anything more.',
        type: 'scenario',
        difficulty: 'easy',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        reviewCount: 2,
        lastReviewedAt: new Date(Date.now() - 3600000).toISOString(),
        mastered: false
      },
      {
        id: '2',
        videoId: 'v2',
        videoTitle: '商务会议',
        question: 'The correct form is: "She ___ the report yesterday."',
        options: [
          'finish',
          'finished',
          'finishing',
          'finishes'
        ],
        correctAnswer: 1,
        userAnswer: 3,
        explanation: 'Use past simple tense for completed actions in the past with time markers like "yesterday".',
        type: 'grammar',
        difficulty: 'medium',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        reviewCount: 1,
        mastered: false
      },
      {
        id: '3',
        videoId: 'v3',
        videoTitle: '机场值机',
        question: 'What does "boarding pass" mean?',
        options: [
          '行李牌',
          '登机牌',
          '护照',
          '机票'
        ],
        correctAnswer: 1,
        userAnswer: 3,
        explanation: 'A boarding pass is a document provided by an airline during check-in, giving permission to board the plane.',
        type: 'vocabulary',
        difficulty: 'easy',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        reviewCount: 3,
        lastReviewedAt: new Date(Date.now() - 7200000).toISOString(),
        mastered: true
      }
    ]

    // 从localStorage加载真实错题
    const saved = localStorage.getItem('mistakes')
    if (saved) {
      setMistakes(JSON.parse(saved))
    } else {
      setMistakes(mockMistakes)
      localStorage.setItem('mistakes', JSON.stringify(mockMistakes))
    }
  }

  const filterMistakes = () => {
    let filtered = [...mistakes]

    // 类型筛选
    if (selectedType) {
      filtered = filtered.filter(m => m.type === selectedType)
    }

    // 难度筛选
    if (selectedDifficulty) {
      filtered = filtered.filter(m => m.difficulty === selectedDifficulty)
    }

    // 掌握状态筛选
    if (showOnlyUnmastered) {
      filtered = filtered.filter(m => !m.mastered)
    }

    // 排序
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'review':
        filtered.sort((a, b) => a.reviewCount - b.reviewCount)
        break
      case 'difficulty':
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
        filtered.sort((a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty])
        break
    }

    setFilteredMistakes(filtered)
  }

  const handleReview = (mistake: Mistake) => {
    setSelectedMistake(mistake)
    setShowQuiz(true)
  }

  const handleQuizComplete = (correct: boolean) => {
    if (selectedMistake) {
      const updatedMistakes = mistakes.map(m => {
        if (m.id === selectedMistake.id) {
          return {
            ...m,
            reviewCount: m.reviewCount + 1,
            lastReviewedAt: new Date().toISOString(),
            mastered: correct && m.reviewCount >= 2 // 答对3次算掌握
          }
        }
        return m
      })
      setMistakes(updatedMistakes)
      localStorage.setItem('mistakes', JSON.stringify(updatedMistakes))
    }
    setShowQuiz(false)
    setSelectedMistake(null)
  }

  const handleDelete = (mistakeId: string) => {
    if (confirm('确定要删除这道错题吗？')) {
      const updatedMistakes = mistakes.filter(m => m.id !== mistakeId)
      setMistakes(updatedMistakes)
      localStorage.setItem('mistakes', JSON.stringify(updatedMistakes))
    }
  }

  const getStats = () => {
    const total = mistakes.length
    const mastered = mistakes.filter(m => m.mastered).length
    const vocabularyCount = mistakes.filter(m => m.type === 'vocabulary').length
    const grammarCount = mistakes.filter(m => m.type === 'grammar').length
    const scenarioCount = mistakes.filter(m => m.type === 'scenario').length

    return {
      total,
      mastered,
      masteryRate: total > 0 ? Math.round((mastered / total) * 100) : 0,
      vocabularyCount,
      grammarCount,
      scenarioCount
    }
  }

  const stats = getStats()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return '📖'
      case 'grammar': return '📝'
      case 'scenario': return '🎬'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/')} className="text-purple-600">
                ← 返回
              </button>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FaBook /> 错题本
              </h1>
            </div>
            <button
              onClick={() => router.push('/quiz-practice')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaBrain />
              智能练习
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 统计卡片 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaChartLine className="text-purple-600" />
            学习统计
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">总错题数</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.mastered}</p>
              <p className="text-sm text-gray-600 mt-1">已掌握</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{stats.masteryRate}%</p>
              <p className="text-sm text-gray-600 mt-1">掌握率</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats.vocabularyCount}</p>
              <p className="text-sm text-gray-600 mt-1">词汇题</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-3xl font-bold text-pink-600">{stats.grammarCount}</p>
              <p className="text-sm text-gray-600 mt-1">语法题</p>
            </div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <span className="font-medium">筛选</span>
          </div>

          {/* 题型筛选 */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">题型</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedType ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {['vocabulary', 'grammar', 'scenario'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type === selectedType ? null : type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    type === selectedType ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'vocabulary' ? '词汇' : type === 'grammar' ? '语法' : '场景'}
                </button>
              ))}
            </div>
          </div>

          {/* 难度筛选 */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">难度</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedDifficulty ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {['easy', 'medium', 'hard'].map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    difficulty === selectedDifficulty ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
                </button>
              ))}
            </div>
          </div>

          {/* 其他选项 */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyUnmastered}
                onChange={(e) => setShowOnlyUnmastered(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm">只显示未掌握</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="date">按时间排序</option>
              <option value="review">按复习次数</option>
              <option value="difficulty">按难度排序</option>
            </select>
          </div>
        </div>

        {/* 错题列表 */}
        {filteredMistakes.length > 0 ? (
          <div className="grid gap-4">
            {filteredMistakes.map((mistake, index) => (
              <motion.div
                key={mistake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(mistake.type)}</span>
                      <h3 className="font-semibold">{mistake.videoTitle}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(mistake.difficulty)}`}>
                        {mistake.difficulty === 'easy' ? '简单' : mistake.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                      {mistake.mastered && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 flex items-center gap-1">
                          <FaCheckCircle /> 已掌握
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{mistake.question}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(mistake.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaRedo />
                        复习 {mistake.reviewCount} 次
                      </span>
                      {mistake.lastReviewedAt && (
                        <span>
                          上次复习: {new Date(mistake.lastReviewedAt).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReview(mistake)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                      <FaRedo />
                      复习
                    </button>
                    <button
                      onClick={() => handleDelete(mistake.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* 答案对比 */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">你的答案</p>
                      <p className="flex items-center gap-2">
                        <FaTimesCircle className="text-red-500" />
                        <span className="text-red-600">{mistake.options[mistake.userAnswer]}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">正确答案</p>
                      <p className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-green-600">{mistake.options[mistake.correctAnswer]}</span>
                      </p>
                    </div>
                  </div>
                  {mistake.explanation && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                        <FaLightbulb className="text-yellow-500" />
                        解析
                      </p>
                      <p className="text-sm text-gray-700">{mistake.explanation}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {mistakes.length === 0 ? '还没有错题记录' : '没有符合条件的错题'}
            </p>
            <p className="text-sm text-gray-400">
              在视频学习中答错的题目会自动收录到这里
            </p>
          </div>
        )}
      </div>

      {/* 复习模态框 */}
      {showQuiz && selectedMistake && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => {
            setShowQuiz(false)
            setSelectedMistake(null)
          }}
          checkpoint={{
            id: `mistake-${selectedMistake.id}`,
            time_percent: 0,
            type: selectedMistake.type as 'scene' | 'vocabulary' | 'grammar',
            question: selectedMistake.question,
            options: selectedMistake.options,
            correct_answer: selectedMistake.correctAnswer,
            explanation: '',
            points: 10
          }}
          onAnswer={(correct, points) => {
            handleQuizComplete(correct)
          }}
        />
      )}
    </div>
  )
}