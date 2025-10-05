'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaTrophy, FaMedal, FaCrown, FaFire, FaClock, FaChartLine } from 'react-icons/fa'

interface LeaderboardUser {
  rank: number
  id: string
  username: string
  avatar: string
  points: number
  streak: number
  studyTime: number // 分钟
  wordsLearned: number
  change: 'up' | 'down' | 'same'
  changeAmount?: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly')
  const [category, setCategory] = useState<'points' | 'streak' | 'time' | 'words'>('points')
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null)

  // 模拟排行榜数据
  const users: LeaderboardUser[] = [
    {
      rank: 1,
      id: '1',
      username: '小雅学英语',
      avatar: 'https://ui-avatars.com/api/?name=Emma&background=FFD700&color=fff',
      points: 3280,
      streak: 45,
      studyTime: 1250,
      wordsLearned: 386,
      change: 'same'
    },
    {
      rank: 2,
      id: '2',
      username: '小明同学',
      avatar: 'https://ui-avatars.com/api/?name=Ming&background=C0C0C0&color=fff',
      points: 3150,
      streak: 38,
      studyTime: 1180,
      wordsLearned: 352,
      change: 'up',
      changeAmount: 1
    },
    {
      rank: 3,
      id: '3',
      username: '露西英语角',
      avatar: 'https://ui-avatars.com/api/?name=Lucy&background=CD7F32&color=fff',
      points: 2980,
      streak: 32,
      studyTime: 1050,
      wordsLearned: 298,
      change: 'up',
      changeAmount: 2
    },
    {
      rank: 4,
      id: '4',
      username: '学霸张',
      avatar: 'https://ui-avatars.com/api/?name=Zhang&background=667eea&color=fff',
      points: 2750,
      streak: 28,
      studyTime: 980,
      wordsLearned: 275,
      change: 'down',
      changeAmount: 2
    },
    {
      rank: 5,
      id: '5',
      username: '大卫英语',
      avatar: 'https://ui-avatars.com/api/?name=David&background=764ba2&color=fff',
      points: 2620,
      streak: 25,
      studyTime: 920,
      wordsLearned: 256,
      change: 'up',
      changeAmount: 3
    },
    {
      rank: 6,
      id: '6',
      username: '英语小白',
      avatar: 'https://ui-avatars.com/api/?name=Bai&background=f093fb&color=fff',
      points: 2480,
      streak: 21,
      studyTime: 850,
      wordsLearned: 234,
      change: 'same'
    },
    {
      rank: 7,
      id: '7',
      username: '莎拉加油',
      avatar: 'https://ui-avatars.com/api/?name=Sarah&background=4ecdc4&color=fff',
      points: 2350,
      streak: 18,
      studyTime: 780,
      wordsLearned: 215,
      change: 'up',
      changeAmount: 1
    },
    {
      rank: 8,
      id: '8',
      username: '学习达人',
      avatar: 'https://ui-avatars.com/api/?name=Da&background=ff6b6b&color=fff',
      points: 2200,
      streak: 15,
      studyTime: 720,
      wordsLearned: 198,
      change: 'down',
      changeAmount: 3
    },
    {
      rank: 9,
      id: '9',
      username: '汤姆英语',
      avatar: 'https://ui-avatars.com/api/?name=Tom&background=f7b731&color=fff',
      points: 2050,
      streak: 12,
      studyTime: 650,
      wordsLearned: 178,
      change: 'same'
    },
    {
      rank: 10,
      id: '10',
      username: '加油鸭',
      avatar: 'https://ui-avatars.com/api/?name=Ya&background=95e1d3&color=fff',
      points: 1920,
      streak: 10,
      studyTime: 580,
      wordsLearned: 162,
      change: 'up',
      changeAmount: 2
    }
  ]

  // 当前用户（你）
  const you: LeaderboardUser = {
    rank: 15,
    id: 'current',
    username: '你',
    avatar: 'https://ui-avatars.com/api/?name=You&background=667eea&color=fff',
    points: 1580,
    streak: 7,
    studyTime: 420,
    wordsLearned: 125,
    change: 'up',
    changeAmount: 5
  }

  useEffect(() => {
    setCurrentUser(you)
  }, [])

  // 根据分类排序
  const getSortedUsers = () => {
    const sorted = [...users]
    switch (category) {
      case 'streak':
        return sorted.sort((a, b) => b.streak - a.streak)
      case 'time':
        return sorted.sort((a, b) => b.studyTime - a.studyTime)
      case 'words':
        return sorted.sort((a, b) => b.wordsLearned - a.wordsLearned)
      default:
        return sorted
    }
  }

  const sortedUsers = getSortedUsers()

  // 获取数值显示
  const getValue = (user: LeaderboardUser) => {
    switch (category) {
      case 'streak':
        return `${user.streak}天`
      case 'time':
        return `${Math.floor(user.studyTime / 60)}h`
      case 'words':
        return `${user.wordsLearned}词`
      default:
        return `${user.points}分`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              排行榜
            </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-purple-600"
            >
              返回
            </button>
          </div>

          {/* 时间范围选择 */}
          <div className="flex gap-2 mt-4">
            {(['daily', 'weekly', 'monthly', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'daily' && '今日'}
                {range === 'weekly' && '本周'}
                {range === 'monthly' && '本月'}
                {range === 'all' && '总榜'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { key: 'points', label: '积分榜', icon: <FaTrophy />, color: 'from-yellow-400 to-orange-500' },
            { key: 'streak', label: '连续榜', icon: <FaFire />, color: 'from-red-500 to-pink-500' },
            { key: 'time', label: '时长榜', icon: <FaClock />, color: 'from-blue-500 to-cyan-500' },
            { key: 'words', label: '词汇榜', icon: <FaChartLine />, color: 'from-green-500 to-teal-500' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key as any)}
              className={`relative p-4 rounded-xl transition-all ${
                category === cat.key
                  ? 'bg-white shadow-lg scale-105'
                  : 'bg-white/60 hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${cat.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                {cat.icon}
              </div>
              <p className="text-sm font-medium">{cat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 排行榜列表 */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* 前三名 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {sortedUsers.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-4 text-center shadow-lg ${
                index === 0 ? 'transform scale-110' : ''
              }`}
            >
              <div className="relative inline-block mb-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-16 h-16 rounded-full"
                />
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                }`}>
                  {index + 1}
                </div>
              </div>
              <p className="font-semibold text-sm mb-1 truncate">{user.username}</p>
              <p className="text-lg font-bold text-purple-600">{getValue(user)}</p>
            </motion.div>
          ))}
        </div>

        {/* 其他排名 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {sortedUsers.slice(3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-semibold text-gray-600">
                  {index + 4}
                </span>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.username}</p>
                  {user.change !== 'same' && (
                    <p className={`text-xs ${
                      user.change === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.change === 'up' ? '↑' : '↓'} {user.changeAmount}
                    </p>
                  )}
                </div>
              </div>
              <p className="font-bold text-lg text-purple-600">
                {getValue(user)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 当前用户位置 */}
        {currentUser && currentUser.rank > 10 && (
          <div className="mt-6">
            <p className="text-center text-gray-500 mb-3">···</p>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center font-bold text-purple-600">
                      {currentUser.rank}
                    </span>
                    <img
                      src={currentUser.avatar}
                      alt="你"
                      className="w-10 h-10 rounded-full border-2 border-purple-600"
                    />
                    <div>
                      <p className="font-bold text-purple-600">你的排名</p>
                      {currentUser.change === 'up' && (
                        <p className="text-xs text-green-600">
                          ↑ 上升{currentUser.changeAmount}名
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-lg text-purple-600">
                    {getValue(currentUser)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">
              继续加油，距离前10还差 {sortedUsers[9].points - currentUser.points} 积分
            </p>
          </div>
        )}
      </div>
    </div>
  )
}