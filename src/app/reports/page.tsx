'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaChartLine, FaCalendarAlt, FaTrophy, FaClock,
  FaBook, FaFire, FaStar, FaDownload, FaFilter,
  FaBrain, FaCheckCircle, FaAward, FaChartPie
} from 'react-icons/fa'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface StudyData {
  date: string
  studyTime: number
  videosWatched: number
  quizzesPassed: number
  wordsLearned: number
  points: number
}

interface SkillData {
  skill: string
  score: number
  fullMark: 100
}

export default function ReportsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')
  const [studyData, setStudyData] = useState<StudyData[]>([])
  const [skillData, setSkillData] = useState<SkillData[]>([])

  useEffect(() => {
    generateReportData()
  }, [timeRange])

  const generateReportData = () => {
    // 根据时间范围生成数据
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365
    const data: StudyData[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // 模拟数据，周末学习时间更长
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const baseTime = isWeekend ? 45 : 30

      data.push({
        date: timeRange === 'year'
          ? date.toLocaleDateString('zh-CN', { month: 'short' })
          : date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        studyTime: baseTime + Math.random() * 30,
        videosWatched: Math.floor(Math.random() * 5) + 1,
        quizzesPassed: Math.floor(Math.random() * 8) + 2,
        wordsLearned: Math.floor(Math.random() * 20) + 5,
        points: Math.floor(Math.random() * 50) + 20
      })
    }

    setStudyData(data)

    // 技能雷达图数据
    setSkillData([
      { skill: '词汇量', score: 75, fullMark: 100 },
      { skill: '语法', score: 68, fullMark: 100 },
      { skill: '听力', score: 82, fullMark: 100 },
      { skill: '口语', score: 65, fullMark: 100 },
      { skill: '阅读', score: 88, fullMark: 100 },
      { skill: '写作', score: 70, fullMark: 100 }
    ])
  }

  // 计算统计数据
  const getStats = () => {
    const totalStudyTime = studyData.reduce((sum, d) => sum + d.studyTime, 0)
    const totalVideos = studyData.reduce((sum, d) => sum + d.videosWatched, 0)
    const totalQuizzes = studyData.reduce((sum, d) => sum + d.quizzesPassed, 0)
    const totalWords = studyData.reduce((sum, d) => sum + d.wordsLearned, 0)
    const totalPoints = studyData.reduce((sum, d) => sum + d.points, 0)
    const avgStudyTime = totalStudyTime / studyData.length

    return {
      totalStudyTime: Math.round(totalStudyTime),
      totalVideos,
      totalQuizzes,
      totalWords,
      totalPoints,
      avgStudyTime: Math.round(avgStudyTime),
      studyDays: studyData.filter(d => d.studyTime > 0).length,
      bestDay: studyData.reduce((max, d) => d.studyTime > max.studyTime ? d : max, studyData[0])
    }
  }

  const stats = studyData.length > 0 ? getStats() : null

  // 分类统计数据
  const categoryData = [
    { name: '日常对话', value: 35, color: '#8b5cf6' },
    { name: '商务英语', value: 25, color: '#ec4899' },
    { name: '旅游英语', value: 20, color: '#3b82f6' },
    { name: '学术英语', value: 20, color: '#10b981' }
  ]

  // 学习习惯数据
  const habitData = [
    { hour: '6-9', value: 15 },
    { hour: '9-12', value: 25 },
    { hour: '12-15', value: 10 },
    { hour: '15-18', value: 20 },
    { hour: '18-21', value: 45 },
    { hour: '21-24', value: 30 }
  ]

  const exportReport = () => {
    if (!stats) return

    const reportContent = `
# 学习报告
生成时间：${new Date().toLocaleString('zh-CN')}

## 学习统计
- 总学习时长：${Math.floor(stats.totalStudyTime / 60)}小时${stats.totalStudyTime % 60}分钟
- 平均每日学习：${stats.avgStudyTime}分钟
- 学习天数：${stats.studyDays}天
- 观看视频：${stats.totalVideos}个
- 通过测验：${stats.totalQuizzes}个
- 掌握单词：${stats.totalWords}个
- 获得积分：${stats.totalPoints}分

## 技能评估
${skillData.map(s => `- ${s.skill}：${s.score}分`).join('\n')}
`

    const blob = new Blob([reportContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learning-report-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/')} className="text-purple-600">
                ← 返回
              </button>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FaChartLine /> 学习报告
              </h1>
            </div>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaDownload />
              导出报告
            </button>
          </div>

          {/* 时间范围选择 */}
          <div className="flex gap-2 mt-4">
            {(['week', 'month', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'week' && '本周'}
                {range === 'month' && '本月'}
                {range === 'year' && '本年'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 核心指标 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <FaClock className="text-2xl text-purple-600" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
              <p className="text-2xl font-bold">{Math.floor(stats.totalStudyTime / 60)}h</p>
              <p className="text-sm text-gray-600">学习时长</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <FaFire className="text-2xl text-orange-500" />
                <span className="text-xs text-green-600">连续</span>
              </div>
              <p className="text-2xl font-bold">{stats.studyDays}</p>
              <p className="text-sm text-gray-600">学习天数</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <FaBook className="text-2xl text-blue-600" />
                <span className="text-xs text-green-600">+8</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalWords}</p>
              <p className="text-sm text-gray-600">掌握单词</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <FaTrophy className="text-2xl text-yellow-500" />
                <span className="text-xs text-green-600">+{stats.totalPoints}</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
              <p className="text-sm text-gray-600">累计积分</p>
            </motion.div>
          </div>
        )}

        {/* 学习趋势图 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold mb-4">学习时长趋势</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="studyTime"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorTime)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold mb-4">学习内容分布</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studyData.slice(-7)}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="videosWatched" fill="#8b5cf6" name="视频" />
                <Bar dataKey="quizzesPassed" fill="#ec4899" name="测验" />
                <Bar dataKey="wordsLearned" fill="#3b82f6" name="单词" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* 技能雷达图和分类饼图 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FaBrain className="text-purple-600" />
              技能评估
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="技能得分"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FaChartPie className="text-purple-600" />
              学习分类
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* 学习习惯 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold mb-4">学习时段分布</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={habitData}>
                <XAxis dataKey="hour" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2">
              你最喜欢在晚上 18-21 点学习
            </p>
          </motion.div>

          {/* 成就和建议 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FaAward className="text-yellow-500" />
              本期成就
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium">学习达人</p>
                  <p className="text-xs text-gray-600">连续学习7天</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-medium">词汇大师</p>
                  <p className="text-xs text-gray-600">掌握100+单词</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-medium">闯关高手</p>
                  <p className="text-xs text-gray-600">连续通过10个测验</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700 mb-1">学习建议</p>
              <p className="text-xs text-gray-600">
                你的听力技能表现优秀，建议加强口语练习。每天尝试跟读一段视频，提升语音语调。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}