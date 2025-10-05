'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaUser, FaTrophy, FaBook, FaClock, FaChartLine,
  FaSignOutAlt, FaCrown, FaFire, FaGem, FaShareAlt
} from 'react-icons/fa'
import ShareModal from '@/components/ShareModal'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [stats, setStats] = useState({
    totalPoints: 1280,
    level: 5,
    streakDays: 7,
    videosWatched: 42,
    wordsLearned: 186,
    quizzesPassed: 38,
    totalMinutes: 520,
    rank: 'Top 10%'
  })

  useEffect(() => {
    // 获取用户信息
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
    } else {
      // 模拟用户数据
      setUser({
        id: 'user-1',
        username: '小雅',
        email: 'emma@example.com',
        avatar_url: 'https://ui-avatars.com/api/?name=Emma&background=667eea&color=fff',
        subscription_status: 'premium',
        created_at: '2024-01-15'
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('demo_user')
    router.push('/auth')
  }

  const achievements = [
    { icon: '🔥', name: '连续7天', desc: '学习一周不间断' },
    { icon: '⚡', name: '闪电手', desc: '30秒内答对题目' },
    { icon: '📚', name: '词汇达人', desc: '掌握100+单词' },
    { icon: '🎯', name: '神射手', desc: '连续答对10题' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-purple-600 dark:text-purple-400 font-semibold"
          >
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">个人中心</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="text-purple-600 dark:text-purple-400"
            >
              <FaShareAlt size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="text-red-500"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex items-center gap-6">
            <img
              src={user?.avatar_url}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-white/30"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                {user?.subscription_status === 'premium' && (
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <FaCrown /> PRO
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm mb-3">{user?.email}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FaTrophy /> Level {stats.level}
                </span>
                <span className="flex items-center gap-1">
                  <FaFire /> {stats.streakDays} 天连续
                </span>
                <span className="flex items-center gap-1">
                  <FaGem /> {stats.totalPoints} 积分
                </span>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Level {stats.level}</span>
              <span>Level {stats.level + 1}</span>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-white h-full"
              />
            </div>
            <p className="text-xs text-white/70 mt-1">还需 220 积分升级</p>
          </div>
        </motion.div>

        {/* 学习统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaChartLine className="text-purple-600" /> 学习统计
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{stats.videosWatched}</p>
              <p className="text-sm text-gray-600 mt-1">视频学习</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">{stats.wordsLearned}</p>
              <p className="text-sm text-gray-600 mt-1">单词掌握</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.quizzesPassed}</p>
              <p className="text-sm text-gray-600 mt-1">闯关成功</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{Math.floor(stats.totalMinutes / 60)}h</p>
              <p className="text-sm text-gray-600 mt-1">学习时长</p>
            </div>
          </div>

          {/* 排名 */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">本周排名</p>
                <p className="text-2xl font-bold text-orange-600">{stats.rank}</p>
              </div>
              <FaTrophy className="text-4xl text-yellow-500" />
            </div>
          </div>
        </motion.div>

        {/* 成就徽章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4">🏆 我的成就</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="font-semibold text-sm">{achievement.name}</p>
                <p className="text-xs text-gray-500 mt-1">{achievement.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 学习历史 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaClock className="text-purple-600" /> 最近学习
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Coffee Shop Conversation', time: '10分钟前', points: '+20', progress: 100 },
              { title: 'Airport Check-in', time: '2小时前', points: '+15', progress: 75 },
              { title: 'Job Interview Tips', time: '昨天', points: '+25', progress: 100 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 font-semibold text-sm">{item.points}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 升级到PRO */}
        {user?.subscription_status !== 'premium' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center"
          >
            <FaCrown className="text-4xl mx-auto mb-3 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">升级到 PRO</h3>
            <p className="text-white/80 mb-4">解锁全部视频和高级功能</p>
            <button
              onClick={() => router.push('/redeem')}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              输入兑换码
            </button>
          </motion.div>
        )}
      </div>

      {/* 分享模态框 */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        data={{
          score: stats.totalPoints,
          streak: stats.streakDays,
          wordsLearned: stats.wordsLearned,
          studyTime: Math.floor(stats.totalMinutes / stats.streakDays)
        }}
      />
    </div>
  )
}