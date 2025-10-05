'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaRocket, FaPlay, FaTrophy, FaBookOpen, FaChartLine, FaGraduationCap } from 'react-icons/fa'

export default function WelcomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const features = [
    {
      icon: <FaPlay className="text-4xl text-white" />,
      title: '抖音式学习',
      description: '上下滑动切换视频，碎片时间高效学习',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaTrophy className="text-4xl text-white" />,
      title: 'AI智能闯关',
      description: '场景化题目，游戏化学习体验',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaBookOpen className="text-4xl text-white" />,
      title: '词汇收藏本',
      description: '一键收藏生词，随时复习巩固',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: <FaChartLine className="text-4xl text-white" />,
      title: '学习数据追踪',
      description: '可视化进度，见证每一天的成长',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const handleStart = () => {
    // 标记已看过引导
    localStorage.setItem('welcome_seen', 'true')

    // 演示账号自动登录
    localStorage.setItem('demo_user', JSON.stringify({
      id: 'demo-user',
      email: 'demo@example.com',
      username: '体验用户',
      total_points: 0
    }))

    router.push('/')
  }

  const handleLogin = () => {
    localStorage.setItem('welcome_seen', 'true')
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {/* 手机框架 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* 顶部进度指示器 */}
          <div className="flex gap-2 p-4 bg-gray-50">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-all ${
                  step <= currentStep ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* 内容区域 */}
          <div className="p-6 h-[600px] flex flex-col">
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <FaGraduationCap className="text-6xl text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Scene English
                  </span>
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  场景化英语学习平台
                </p>
                <p className="text-gray-500 text-sm">
                  刷视频学英语，AI陪你闯关
                </p>
              </motion.div>
            )}

            {currentStep > 0 && currentStep <= 4 && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className={`w-24 h-24 bg-gradient-to-r ${features[currentStep - 1].gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  {features[currentStep - 1].icon}
                </div>
                <h2 className="text-2xl font-bold mb-3">
                  {features[currentStep - 1].title}
                </h2>
                <p className="text-gray-600 text-center">
                  {features[currentStep - 1].description}
                </p>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <FaRocket className="text-6xl text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">准备开始了吗？</h2>
                <p className="text-gray-600 mb-2">
                  每天15分钟，轻松提升英语水平
                </p>
                <p className="text-sm text-gray-500">
                  限时优惠：¥39.9 永久会员
                </p>
              </motion.div>
            )}

            {/* 底部按钮 */}
            <div className="mt-auto space-y-3">
              {currentStep < 5 ? (
                <>
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {currentStep === 0 ? '开始了解' : '下一步'}
                  </button>
                  {currentStep > 0 && (
                    <button
                      onClick={handleStart}
                      className="w-full text-gray-500 py-2"
                    >
                      跳过
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleStart}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    立即体验
                  </button>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    登录账号
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  )
}