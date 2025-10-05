'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPlayer from '@/components/video/VideoPlayer'
import QuizModal from '@/components/quiz/QuizModal'
import { Video } from '@/types/video'
import { mockVideos } from '@/data/mockVideos'
import { FaHome, FaSearch, FaBookmark, FaUser, FaStar, FaTrophy, FaFire } from 'react-icons/fa'
import GameCard from '@/components/ui/GameCard'
import { LevelBadge } from '@/components/ui/Achievement'

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [currentCheckpoint, setCurrentCheckpoint] = useState<any>(null)
  const [userScore, setUserScore] = useState(0)
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([])
  const [userLevel, setUserLevel] = useState(1)
  const [userXp, setUserXp] = useState(0)
  const [streak, setStreak] = useState(7)

  const currentVideo = mockVideos[currentVideoIndex]
  const xpRequired = userLevel * 1000

  // 处理视频切换
  const handleSwipeUp = () => {
    setCurrentVideoIndex((prev) =>
      prev < mockVideos.length - 1 ? prev + 1 : 0
    )
  }

  const handleSwipeDown = () => {
    setCurrentVideoIndex((prev) =>
      prev > 0 ? prev - 1 : mockVideos.length - 1
    )
  }

  // 处理闯关触发
  const handleCheckpoint = (timePercent: number) => {
    const checkpoint = currentVideo.checkpoints.find(
      cp => cp.time_percent === timePercent
    )

    if (checkpoint && !completedCheckpoints.includes(checkpoint.id)) {
      setCurrentCheckpoint(checkpoint)
      setIsQuizOpen(true)
    }
  }

  // 处理答题结果
  const handleAnswer = (correct: boolean, points: number) => {
    setUserScore((prev) => prev + points)

    // 增加经验值
    const xpGained = correct ? points * 10 : 5
    setUserXp((prev) => {
      const newXp = prev + xpGained
      // 检查是否升级
      if (newXp >= xpRequired) {
        setUserLevel((level) => level + 1)
        return newXp - xpRequired
      }
      return newXp
    })

    if (correct && currentCheckpoint) {
      setCompletedCheckpoints((prev) => [...prev, currentCheckpoint.id])
    }
  }

  return (
    <div className="relative h-screen w-full bg-gray-900 dark:bg-black overflow-hidden">
      {/* 视频播放器 */}
      <VideoPlayer
        video={currentVideo}
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
        onCheckpoint={handleCheckpoint}
      />

      {/* 顶部游戏化状态栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧 - 等级和经验值 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <LevelBadge
              level={userLevel}
              xp={userXp}
              xpRequired={xpRequired}
              size="sm"
              showProgress
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">小雅</span>
                <span className="px-2 py-0.5 bg-gradient-candy text-white text-xs rounded-full font-bold">PRO</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <FaStar className="text-game-gold text-xs" />
                  <span className="text-game-gold font-bold text-sm">{userScore.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaFire className="text-accent-coral text-xs" />
                  <span className="text-accent-coral font-bold text-sm">{streak}天</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧 - 快捷操作 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <FaTrophy className="text-lg" />
            </button>
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="w-10 h-10 bg-gradient-candy rounded-xl flex items-center justify-center text-white hover:brightness-110 transition-all shadow-lg"
            >
              <span className="font-bold text-sm">#3</span>
            </button>
          </motion.div>
        </div>

        {/* 经验值进度条 */}
        <div className="mt-2">
          <div className="h-1.5 bg-white/10 backdrop-blur-md rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(userXp / xpRequired) * 100}%` }}
              className="h-full bg-gradient-to-r from-accent-purple via-accent-pink to-accent-yellow rounded-full"
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* AI闯关弹窗 */}
      {currentCheckpoint && (
        <QuizModal
          checkpoint={currentCheckpoint}
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          onAnswer={handleAnswer}
        />
      )}

      {/* 游戏化底部导航栏 */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl md:hidden"
      >
        <div className="flex justify-around items-center h-20 pb-safe">
          {/* 首页按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="relative flex flex-col items-center gap-1 text-white p-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <FaHome className="text-xl text-white" />
              </div>
            </div>
            <span className="text-xs font-medium text-white mt-1">首页</span>
          </motion.button>

          {/* 探索按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/explore'}
            className="relative flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors p-2"
          >
            <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
              <FaSearch className="text-xl" />
            </div>
            <span className="text-xs font-medium mt-1">探索</span>
          </motion.button>

          {/* 收藏按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/vocabulary'}
            className="relative flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors p-2"
          >
            <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
              <FaBookmark className="text-xl" />
            </div>
            <span className="text-xs font-medium mt-1">收藏</span>
            {/* 收藏数量提示 */}
            <div className="absolute top-1 right-1 w-5 h-5 bg-accent-pink rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </motion.button>

          {/* 我的按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const user = localStorage.getItem('demo_user')
              window.location.href = user ? '/profile' : '/auth'
            }}
            className="relative flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors p-2"
          >
            <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
              <FaUser className="text-xl" />
            </div>
            <span className="text-xs font-medium mt-1">我的</span>
            {/* 红点提示 */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></div>
          </motion.button>
        </div>
      </motion.div>

      {/* 视频指示器 */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
        {mockVideos.map((_, index) => (
          <div
            key={index}
            className={`h-0.5 transition-all duration-300 ${
              index === currentVideoIndex
                ? 'w-8 bg-white'
                : 'w-4 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
