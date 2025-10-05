'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarCheck, FaFire, FaTrophy, FaGift,
  FaStar, FaCrown, FaMedal, FaAward
} from 'react-icons/fa'
import confetti from 'canvas-confetti'

interface CheckinRecord {
  date: string
  timestamp: number
  points: number
}

interface CheckinStats {
  totalDays: number
  currentStreak: number
  longestStreak: number
  thisMonthDays: number
  totalPoints: number
  lastCheckin: string | null
}

export default function CheckinPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [checkinRecords, setCheckinRecords] = useState<CheckinRecord[]>([])
  const [stats, setStats] = useState<CheckinStats>({
    totalDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisMonthDays: 0,
    totalPoints: 0,
    lastCheckin: null
  })
  const [hasCheckedToday, setHasCheckedToday] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [todayReward, setTodayReward] = useState(0)

  useEffect(() => {
    loadCheckinData()
  }, [currentDate])

  const loadCheckinData = () => {
    const saved = localStorage.getItem('checkin_records')
    if (saved) {
      const records: CheckinRecord[] = JSON.parse(saved)
      setCheckinRecords(records)
      calculateStats(records)

      // 检查今天是否已打卡
      const today = new Date().toDateString()
      const todayChecked = records.some(r => new Date(r.date).toDateString() === today)
      setHasCheckedToday(todayChecked)
    }
  }

  const calculateStats = (records: CheckinRecord[]) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // 计算本月打卡天数
    const thisMonthDays = records.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).length

    // 计算连续打卡天数
    let currentStreak = 0
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)

    // 从今天开始往前检查
    while (true) {
      const dateStr = checkDate.toDateString()
      const found = records.some(r => new Date(r.date).toDateString() === dateStr)

      if (!found) {
        // 如果是今天且还没打卡，继续检查昨天
        if (checkDate.toDateString() === new Date().toDateString()) {
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
        break
      }

      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    // 计算最长连续打卡天数
    const longestStreak = Math.max(currentStreak, ...records.map(() => currentStreak))

    // 计算总积分
    const totalPoints = records.reduce((sum, r) => sum + r.points, 0)

    setStats({
      totalDays: records.length,
      currentStreak,
      longestStreak,
      thisMonthDays,
      totalPoints,
      lastCheckin: records.length > 0 ? records[records.length - 1].date : null
    })
  }

  const handleCheckin = async () => {
    if (hasCheckedToday) return

    // 计算奖励积分
    const basePoints = 10
    const streakBonus = Math.min(stats.currentStreak, 30) * 2 // 连续打卡加成，最多30天
    const reward = basePoints + streakBonus

    const newRecord: CheckinRecord = {
      date: new Date().toISOString(),
      timestamp: Date.now(),
      points: reward
    }

    const updatedRecords = [...checkinRecords, newRecord]
    setCheckinRecords(updatedRecords)
    localStorage.setItem('checkin_records', JSON.stringify(updatedRecords))

    // 更新用户积分
    const userPoints = parseInt(localStorage.getItem('user_points') || '0')
    localStorage.setItem('user_points', String(userPoints + reward))

    // 显示奖励动画
    setTodayReward(reward)
    setShowReward(true)
    setHasCheckedToday(true)

    // 发射彩带动画
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    calculateStats(updatedRecords)

    setTimeout(() => {
      setShowReward(false)
    }, 3000)
  }

  // 获取当月日历数据
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const isDateChecked = (date: Date) => {
    return checkinRecords.some(r =>
      new Date(r.date).toDateString() === date.toDateString()
    )
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // 获取打卡等级和图标
  const getStreakLevel = () => {
    const streak = stats.currentStreak
    if (streak >= 365) return { level: '传奇', icon: <FaCrown />, color: 'text-purple-600' }
    if (streak >= 100) return { level: '大师', icon: <FaAward />, color: 'text-yellow-600' }
    if (streak >= 30) return { level: '专家', icon: <FaMedal />, color: 'text-orange-600' }
    if (streak >= 7) return { level: '坚持者', icon: <FaTrophy />, color: 'text-blue-600' }
    if (streak >= 3) return { level: '起步者', icon: <FaStar />, color: 'text-green-600' }
    return { level: '新手', icon: <FaFire />, color: 'text-gray-600' }
  }

  const streakLevel = getStreakLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-purple-600">
            ← 返回
          </button>
          <h1 className="text-xl font-bold">学习打卡</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 打卡统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">今日打卡</h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>

            {/* 打卡按钮 */}
            <motion.button
              whileHover={{ scale: hasCheckedToday ? 1 : 1.05 }}
              whileTap={{ scale: hasCheckedToday ? 1 : 0.95 }}
              onClick={handleCheckin}
              disabled={hasCheckedToday}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                hasCheckedToday
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              {hasCheckedToday ? '已打卡 ✓' : '立即打卡'}
            </motion.button>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaFire className="text-orange-500" />
                <p className="text-3xl font-bold text-purple-600">{stats.currentStreak}</p>
              </div>
              <p className="text-sm text-gray-600">连续打卡</p>
            </div>

            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-3xl font-bold text-pink-600">{stats.totalDays}</p>
              <p className="text-sm text-gray-600">累计打卡</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.thisMonthDays}</p>
              <p className="text-sm text-gray-600">本月打卡</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{stats.totalPoints}</p>
              <p className="text-sm text-gray-600">获得积分</p>
            </div>
          </div>

          {/* 打卡等级 */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`text-2xl ${streakLevel.color}`}>
                {streakLevel.icon}
              </div>
              <div>
                <p className="font-semibold">当前等级：{streakLevel.level}</p>
                <p className="text-xs text-gray-600">
                  {stats.currentStreak >= 7
                    ? `还需 ${stats.currentStreak < 30 ? 30 - stats.currentStreak :
                               stats.currentStreak < 100 ? 100 - stats.currentStreak :
                               stats.currentStreak < 365 ? 365 - stats.currentStreak : 0} 天升级`
                    : '继续加油，连续7天即可升级！'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">最长连续</p>
              <p className="font-bold text-lg">{stats.longestStreak} 天</p>
            </div>
          </div>
        </motion.div>

        {/* 日历组件 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          {/* 月份导航 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(newDate.getMonth() - 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h3 className="text-lg font-bold">
              {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(newDate.getMonth() + 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-sm text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div className="grid grid-cols-7 gap-2">
            {getCalendarDays().map((date, index) => {
              const checked = isDateChecked(date)
              const today = isToday(date)
              const currentMonth = isCurrentMonth(date)

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-lg
                    ${!currentMonth ? 'opacity-30' : ''}
                    ${today ? 'ring-2 ring-purple-600' : ''}
                    ${checked ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' : 'bg-gray-50'}
                    ${today && !checked && currentMonth ? 'bg-purple-100' : ''}
                  `}
                >
                  <span className={`text-sm ${checked ? 'font-bold' : ''}`}>
                    {date.getDate()}
                  </span>
                  {checked && (
                    <FaCalendarCheck className="text-xs mt-1" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* 打卡奖励 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mt-6"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaGift className="text-purple-600" /> 打卡奖励规则
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">基础奖励</span>
              <span className="font-semibold text-purple-600">+10 积分</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">连续3天</span>
              <span className="font-semibold text-green-600">+16 积分/天</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">连续7天</span>
              <span className="font-semibold text-blue-600">+24 积分/天</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">连续30天</span>
              <span className="font-semibold text-orange-600">+70 积分/天</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 打卡成功提示 */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-2xl font-bold text-center mb-1">打卡成功！</p>
              <p className="text-center">获得 {todayReward} 积分 🎉</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}