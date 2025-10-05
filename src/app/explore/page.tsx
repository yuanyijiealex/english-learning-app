'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaStar, FaClock, FaPlay, FaFire, FaTrophy } from 'react-icons/fa'

export default function ExplorePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedDifficulty, setSelectedDifficulty] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: '全部', emoji: '🌟' },
    { name: '日常生活', emoji: '☕' },
    { name: '旅行', emoji: '✈️' },
    { name: '职场', emoji: '💼' },
    { name: '科技', emoji: '💻' },
    { name: '美食', emoji: '🍔' },
    { name: '运动', emoji: '⚽' },
    { name: '娱乐', emoji: '🎬' },
  ]

  const videos = [
    {
      id: 1,
      title: '咖啡店闲聊',
      category: '日常生活',
      difficulty: 2,
      duration: 180,
      views: 15234,
      rating: 4.8,
      thumbnail: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Coffee',
      tag: 'HOT',
      description: '学习咖啡店常用对话'
    },
    {
      id: 2,
      title: '机场安检',
      category: '旅行',
      difficulty: 3,
      duration: 240,
      views: 8932,
      rating: 4.6,
      thumbnail: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Airport',
      tag: 'NEW',
      description: '机场安检实用英语'
    },
    {
      id: 3,
      title: '求职面试技巧',
      category: '职场',
      difficulty: 4,
      duration: 300,
      views: 21456,
      rating: 4.9,
      thumbnail: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=Interview',
      tag: 'TOP',
      description: '面试技巧与常见问题'
    },
    {
      id: 4,
      title: '网上订餐',
      category: '美食',
      difficulty: 2,
      duration: 150,
      views: 5678,
      rating: 4.5,
      thumbnail: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Food',
      description: '网上订餐实用英语'
    },
    {
      id: 5,
      title: '科技产品评测',
      category: '科技',
      difficulty: 4,
      duration: 360,
      views: 12890,
      rating: 4.7,
      thumbnail: 'https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Tech',
      tag: 'PRO',
      description: '科技产品评测词汇'
    },
    {
      id: 6,
      title: '健身房对话',
      category: '运动',
      difficulty: 3,
      duration: 200,
      views: 7234,
      rating: 4.6,
      thumbnail: 'https://via.placeholder.com/300x200/f7b731/ffffff?text=Gym',
      description: '健身房常用对话'
    },
  ]

  const filteredVideos = videos.filter(video => {
    const matchCategory = selectedCategory === '全部' || video.category === selectedCategory
    const matchDifficulty = selectedDifficulty === 0 || video.difficulty === selectedDifficulty
    const matchSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchDifficulty && matchSearch
  })

  const tagColors: Record<string, string> = {
    'HOT': 'bg-red-500',
    'NEW': 'bg-green-500',
    'TOP': 'bg-yellow-500',
    'PRO': 'bg-purple-500',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              探索学习
            </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              返回
            </button>
          </div>

          {/* 搜索栏 */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索视频..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 难度筛选 */}
        <div className="flex items-center gap-4 mt-4">
          <span className="text-gray-600 dark:text-gray-400 text-sm">难度：</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                selectedDifficulty === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {level === 0 ? '全部' : '★'.repeat(level)}
            </button>
          ))}
        </div>
      </div>

      {/* 视频列表 */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/?video=${video.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              {/* 缩略图 */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <FaPlay className="text-white text-3xl" />
                </div>
                {video.tag && (
                  <span className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded ${tagColors[video.tag]}`}>
                    {video.tag}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                </span>
              </div>

              {/* 信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                  {video.description}
                </p>

                {/* 标签 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                    {video.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {'★'.split('').map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${
                          i < video.difficulty ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 统计 */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaPlay /> {(video.views / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {video.rating}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => router.push('/')}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400"
            >
              <FaPlay />
              <span className="text-xs">学习</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-purple-600 dark:text-purple-400">
              <FaSearch />
              <span className="text-xs">探索</span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400"
            >
              <FaTrophy />
              <span className="text-xs">我的</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}