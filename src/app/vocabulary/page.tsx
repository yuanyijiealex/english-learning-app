'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaBookmark, FaStar, FaPlay, FaTrash, FaSearch, FaSort } from 'react-icons/fa'

interface Word {
  id: string
  word: string
  translation: string
  example: string
  source: string
  difficulty: number
  reviewCount: number
  mastery: number
  collectedAt: Date
}

export default function VocabularyPage() {
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'mastery' | 'difficulty'>('date')
  const [selectedDifficulty, setSelectedDifficulty] = useState(0)

  useEffect(() => {
    // 模拟加载词汇数据
    const mockWords: Word[] = [
      {
        id: '1',
        word: 'grab',
        translation: '抓取；快速获得',
        example: "Let's grab a coffee",
        source: '咖啡店对话',
        difficulty: 2,
        reviewCount: 3,
        mastery: 60,
        collectedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        word: 'heading',
        translation: '前往；去向',
        example: "I'm heading to London",
        source: '机场值机',
        difficulty: 2,
        reviewCount: 5,
        mastery: 80,
        collectedAt: new Date('2024-01-19')
      },
      {
        id: '3',
        word: 'detail-oriented',
        translation: '注重细节的',
        example: "I'm detail-oriented and organized",
        source: '求职面试技巧',
        difficulty: 4,
        reviewCount: 2,
        mastery: 40,
        collectedAt: new Date('2024-01-18')
      },
      {
        id: '4',
        word: 'on time',
        translation: '准时；按时',
        example: 'The flight is on time',
        source: '机场值机',
        difficulty: 1,
        reviewCount: 8,
        mastery: 100,
        collectedAt: new Date('2024-01-17')
      },
      {
        id: '5',
        word: 'strengths',
        translation: '优点；长处',
        example: 'What are your greatest strengths?',
        source: '求职面试技巧',
        difficulty: 3,
        reviewCount: 4,
        mastery: 70,
        collectedAt: new Date('2024-01-16')
      }
    ]

    setWords(mockWords)
  }, [])

  // 过滤和排序词汇
  const filteredWords = words
    .filter(word => {
      const matchSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.translation.includes(searchQuery)
      const matchDifficulty = selectedDifficulty === 0 || word.difficulty === selectedDifficulty
      return matchSearch && matchDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'mastery':
          return b.mastery - a.mastery
        case 'difficulty':
          return b.difficulty - a.difficulty
        default:
          return b.collectedAt.getTime() - a.collectedAt.getTime()
      }
    })

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600 bg-green-50'
    if (mastery >= 60) return 'text-yellow-600 bg-yellow-50'
    if (mastery >= 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const handleReview = (wordId: string) => {
    // 这里可以跳转到复习页面或打开复习弹窗
    console.log('Review word:', wordId)
  }

  const handleDelete = (wordId: string) => {
    setWords(words.filter(w => w.id !== wordId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              我的词汇本
            </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-purple-600"
            >
              返回
            </button>
          </div>

          {/* 搜索和筛选 */}
          <div className="space-y-3">
            {/* 搜索栏 */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索单词或翻译..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 筛选选项 */}
            <div className="flex items-center justify-between">
              {/* 难度筛选 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">难度:</span>
                {[0, 1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`px-2 py-1 rounded text-xs ${
                      selectedDifficulty === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level === 0 ? '全部' : '★'.repeat(level)}
                  </button>
                ))}
              </div>

              {/* 排序 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">最新收藏</option>
                <option value="mastery">掌握程度</option>
                <option value="difficulty">难度</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 text-center shadow-md"
          >
            <p className="text-2xl font-bold text-purple-600">{words.length}</p>
            <p className="text-xs text-gray-600">总词汇</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 text-center shadow-md"
          >
            <p className="text-2xl font-bold text-green-600">
              {words.filter(w => w.mastery >= 80).length}
            </p>
            <p className="text-xs text-gray-600">已掌握</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 text-center shadow-md"
          >
            <p className="text-2xl font-bold text-yellow-600">
              {words.filter(w => w.mastery < 80 && w.mastery >= 40).length}
            </p>
            <p className="text-xs text-gray-600">学习中</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-4 text-center shadow-md"
          >
            <p className="text-2xl font-bold text-red-600">
              {words.filter(w => w.mastery < 40).length}
            </p>
            <p className="text-xs text-gray-600">需复习</p>
          </motion.div>
        </div>

        {/* 词汇列表 */}
        <div className="space-y-3">
          {filteredWords.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 单词和翻译 */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{word.word}</h3>
                    <span className="text-gray-600">—</span>
                    <span className="text-gray-600">{word.translation}</span>
                    {/* 难度 */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-xs ${
                            i < word.difficulty ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 例句 */}
                  <p className="text-sm text-gray-600 mb-2 italic">
                    "{word.example}"
                  </p>

                  {/* 来源和统计 */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaPlay /> {word.source}
                    </span>
                    <span>复习 {word.reviewCount} 次</span>
                    <span>
                      {new Date(word.collectedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>

                {/* 掌握度和操作 */}
                <div className="flex flex-col items-end gap-2">
                  {/* 掌握度 */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMasteryColor(word.mastery)}`}>
                    {word.mastery}%
                  </span>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(word.id)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <FaPlay size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 掌握度进度条 */}
              <div className="mt-3">
                <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${word.mastery}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                    className={`h-full ${
                      word.mastery >= 80 ? 'bg-green-500' :
                      word.mastery >= 60 ? 'bg-yellow-500' :
                      word.mastery >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredWords.length === 0 && (
          <div className="text-center py-12">
            <FaBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">还没有收藏的单词</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              开始学习
            </button>
          </div>
        )}
      </div>
    </div>
  )
}