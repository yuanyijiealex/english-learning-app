'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt, FaFlag, FaChartLine, FaTrophy,
  FaClock, FaBook, FaCheck, FaEdit, FaTrash,
  FaPlus, FaRocket, FaBullseye, FaAward
} from 'react-icons/fa'

interface StudyGoal {
  id: string
  title: string
  description: string
  targetDate: string
  category: 'vocabulary' | 'grammar' | 'speaking' | 'listening' | 'general'
  target: number
  current: number
  unit: string
  icon: string
  color: string
  status: 'active' | 'completed' | 'paused'
  createdAt: string
}

interface DailyPlan {
  id: string
  date: string
  tasks: {
    id: string
    title: string
    type: 'video' | 'quiz' | 'review' | 'practice'
    duration: number // 分钟
    completed: boolean
    completedAt?: string
  }[]
}

export default function PlanPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<StudyGoal[]>([])
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([])
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'goals' | 'daily' | 'progress'>('goals')
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null)

  // 新目标表单状态
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'general' as StudyGoal['category'],
    target: 30,
    unit: '天'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // 加载学习目标
    const savedGoals = localStorage.getItem('study_goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    } else {
      // 默认目标
      const defaultGoals: StudyGoal[] = [
        {
          id: '1',
          title: '30天掌握日常对话',
          description: '学习日常生活场景的英语表达',
          targetDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          category: 'speaking',
          target: 30,
          current: 7,
          unit: '天',
          icon: '🗣️',
          color: 'from-blue-500 to-cyan-500',
          status: 'active',
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          id: '2',
          title: '掌握500个核心词汇',
          description: '学习最常用的英语单词',
          targetDate: new Date(Date.now() + 60 * 86400000).toISOString(),
          category: 'vocabulary',
          target: 500,
          current: 126,
          unit: '词',
          icon: '📚',
          color: 'from-purple-500 to-pink-500',
          status: 'active',
          createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
        }
      ]
      setGoals(defaultGoals)
      localStorage.setItem('study_goals', JSON.stringify(defaultGoals))
    }

    // 加载每日计划
    generateDailyPlans()
  }

  const generateDailyPlans = () => {
    const plans: DailyPlan[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)

      plans.push({
        id: `plan-${i}`,
        date: date.toISOString(),
        tasks: [
          {
            id: `task-${i}-1`,
            title: '观看场景视频',
            type: 'video',
            duration: 10,
            completed: i === 0 ? Math.random() > 0.5 : false,
            completedAt: i === 0 && Math.random() > 0.5 ? new Date().toISOString() : undefined
          },
          {
            id: `task-${i}-2`,
            title: 'AI闯关练习',
            type: 'quiz',
            duration: 15,
            completed: false
          },
          {
            id: `task-${i}-3`,
            title: '复习错题',
            type: 'review',
            duration: 10,
            completed: false
          },
          {
            id: `task-${i}-4`,
            title: '口语练习',
            type: 'practice',
            duration: 5,
            completed: false
          }
        ]
      })
    }

    setDailyPlans(plans)
  }

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return

    const categoryConfig = {
      vocabulary: { icon: '📚', color: 'from-purple-500 to-pink-500' },
      grammar: { icon: '📝', color: 'from-green-500 to-teal-500' },
      speaking: { icon: '🗣️', color: 'from-blue-500 to-cyan-500' },
      listening: { icon: '👂', color: 'from-orange-500 to-red-500' },
      general: { icon: '🎯', color: 'from-gray-500 to-gray-700' }
    }

    const config = categoryConfig[newGoal.category]

    const goal: StudyGoal = {
      id: `goal-${Date.now()}`,
      ...newGoal,
      ...config,
      current: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    localStorage.setItem('study_goals', JSON.stringify(updatedGoals))

    setShowGoalModal(false)
    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      category: 'general',
      target: 30,
      unit: '天'
    })
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('确定要删除这个学习目标吗？')) {
      const updatedGoals = goals.filter(g => g.id !== goalId)
      setGoals(updatedGoals)
      localStorage.setItem('study_goals', JSON.stringify(updatedGoals))
    }
  }

  const toggleTaskComplete = (planId: string, taskId: string) => {
    const updatedPlans = dailyPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tasks: plan.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined
              }
            }
            return task
          })
        }
      }
      return plan
    })
    setDailyPlans(updatedPlans)
  }

  const getProgress = (goal: StudyGoal) => {
    return Math.min(100, Math.round((goal.current / goal.target) * 100))
  }

  const getDaysLeft = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diff = target.getTime() - today.getTime()
    return Math.ceil(diff / 86400000)
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
                <FaCalendarAlt /> 学习计划
              </h1>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaPlus />
              新建目标
            </button>
          </div>

          {/* 标签页 */}
          <div className="flex gap-4 mt-4">
            {[
              { key: 'goals', label: '学习目标', icon: <FaFlag /> },
              { key: 'daily', label: '每日计划', icon: <FaCalendarAlt /> },
              { key: 'progress', label: '进度统计', icon: <FaChartLine /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 学习目标 */}
        {selectedTab === 'goals' && (
          <div className="grid gap-4">
            {goals.filter(g => g.status === 'active').map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl p-3 rounded-xl bg-gradient-to-r ${goal.color} text-white flex items-center justify-center`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{goal.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          剩余 {getDaysLeft(goal.targetDate)} 天
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBullseye />
                          目标: {goal.target} {goal.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* 进度条 */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>进度: {goal.current} / {goal.target} {goal.unit}</span>
                    <span className="font-semibold">{getProgress(goal)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgress(goal)}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${goal.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {goals.filter(g => g.status === 'active').length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FaFlag className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">还没有设定学习目标</p>
                <p className="text-sm text-gray-400">点击"新建目标"开始制定你的学习计划</p>
              </div>
            )}
          </div>
        )}

        {/* 每日计划 */}
        {selectedTab === 'daily' && (
          <div className="space-y-4">
            {dailyPlans.slice(0, 3).map((plan, index) => {
              const date = new Date(plan.date)
              const isToday = date.toDateString() === new Date().toDateString()
              const completedCount = plan.tasks.filter(t => t.completed).length

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-6 shadow-lg ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        {isToday ? '今日计划' :
                         index === 1 ? '明日计划' :
                         date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        完成进度: {completedCount} / {plan.tasks.length}
                      </p>
                    </div>
                    {isToday && (
                      <div className="text-2xl">
                        {completedCount === plan.tasks.length ? '🏆' : '💪'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {plan.tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => isToday && toggleTaskComplete(plan.id, task.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          task.completed
                            ? 'bg-green-50 border-green-200'
                            : isToday
                              ? 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                              : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-400'
                          }`}>
                            {task.completed && <FaCheck className="text-white text-xs" />}
                          </div>
                          <div>
                            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {task.type === 'video' && '📹 视频学习'}
                              {task.type === 'quiz' && '🎯 闯关练习'}
                              {task.type === 'review' && '📝 复习巩固'}
                              {task.type === 'practice' && '🗣️ 口语练习'}
                              · {task.duration}分钟
                            </p>
                          </div>
                        </div>
                        {task.completed && task.completedAt && (
                          <span className="text-xs text-green-600">
                            {new Date(task.completedAt).toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 总时长 */}
                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
                    <span>预计学习时长</span>
                    <span className="font-semibold">
                      {plan.tasks.reduce((sum, t) => sum + t.duration, 0)} 分钟
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* 进度统计 */}
        {selectedTab === 'progress' && (
          <div className="grid gap-6">
            {/* 总体统计 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                学习成就
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">21</p>
                  <p className="text-sm text-gray-600 mt-1">学习天数</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">126</p>
                  <p className="text-sm text-gray-600 mt-1">完成任务</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">18.5</p>
                  <p className="text-sm text-gray-600 mt-1">学习时长(小时)</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">85%</p>
                  <p className="text-sm text-gray-600 mt-1">计划完成率</p>
                </div>
              </div>
            </div>

            {/* 目标进度 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">目标达成情况</h3>
              <div className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id} className="flex items-center gap-4">
                    <div className="text-2xl">{goal.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-gray-600">{getProgress(goal)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all`}
                          style={{ width: `${getProgress(goal)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 新建目标模态框 */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">新建学习目标</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">目标名称</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="例如：30天突破口语"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">目标描述</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  rows={2}
                  placeholder="描述你的学习目标..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">类别</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="general">综合</option>
                  <option value="vocabulary">词汇</option>
                  <option value="grammar">语法</option>
                  <option value="speaking">口语</option>
                  <option value="listening">听力</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">目标数值</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">单位</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="天/词/小时"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">目标日期</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleCreateGoal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                创建目标
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}