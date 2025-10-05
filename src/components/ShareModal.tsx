'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaShareAlt, FaWeixin, FaQrcode, FaLink,
  FaTimes, FaCheck, FaImage, FaDownload
} from 'react-icons/fa'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  data?: {
    title?: string
    score?: number
    streak?: number
    wordsLearned?: number
    studyTime?: number
  }
}

export default function ShareModal({ isOpen, onClose, data }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  // 生成分享文案
  const generateShareText = () => {
    const texts = [
      `🎉 我在Scene English学习英语第${data?.streak || 7}天！`,
      `📚 今日学习成果：`,
      `✅ 累计积分：${data?.score || 1280}分`,
      `📖 掌握单词：${data?.wordsLearned || 186}个`,
      `⏰ 学习时长：${data?.studyTime || 28}分钟`,
      ``,
      `🔥 坚持就是胜利！一起来刷视频学英语吧！`,
      ``,
      `👉 点击链接开始学习：scene-english.com`,
      `#英语学习 #场景英语 #每日打卡`
    ]
    return texts.join('\n')
  }

  // 复制链接
  const copyLink = () => {
    const text = generateShareText()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 生成海报
  const generatePoster = () => {
    setGenerating(true)

    // 创建canvas生成海报
    const canvas = document.createElement('canvas')
    canvas.width = 750
    canvas.height = 1334
    const ctx = canvas.getContext('2d')!

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 白色卡片
    ctx.fillStyle = 'white'
    ctx.roundRect(50, 200, 650, 900, 20)
    ctx.fill()

    // 标题
    ctx.font = 'bold 48px sans-serif'
    ctx.fillStyle = '#1a1a1a'
    ctx.textAlign = 'center'
    ctx.fillText('Scene English', canvas.width / 2, 300)

    // 副标题
    ctx.font = '28px sans-serif'
    ctx.fillStyle = '#666'
    ctx.fillText('场景化英语学习平台', canvas.width / 2, 350)

    // 学习数据
    ctx.font = 'bold 36px sans-serif'
    ctx.fillStyle = '#667eea'
    ctx.fillText(`连续学习 ${data?.streak || 7} 天`, canvas.width / 2, 500)

    // 统计数据
    const stats = [
      { label: '累计积分', value: `${data?.score || 1280}`, icon: '🏆' },
      { label: '掌握单词', value: `${data?.wordsLearned || 186}`, icon: '📚' },
      { label: '学习时长', value: `${data?.studyTime || 28}分钟`, icon: '⏱️' }
    ]

    stats.forEach((stat, index) => {
      const y = 600 + index * 100
      // 图标
      ctx.font = '36px sans-serif'
      ctx.fillText(stat.icon, 200, y)
      // 标签
      ctx.font = '24px sans-serif'
      ctx.fillStyle = '#666'
      ctx.textAlign = 'left'
      ctx.fillText(stat.label, 250, y - 5)
      // 数值
      ctx.font = 'bold 32px sans-serif'
      ctx.fillStyle = '#1a1a1a'
      ctx.textAlign = 'right'
      ctx.fillText(stat.value, 550, y)
    })

    // 二维码占位
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(275, 900, 200, 200)
    ctx.font = '20px sans-serif'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'
    ctx.fillText('扫码开始学习', canvas.width / 2, 1140)

    // 底部文字
    ctx.font = '24px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('刷视频学英语，AI陪你闯关', canvas.width / 2, 1250)

    // 下载图片
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `scene-english-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
      setGenerating(false)
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            {/* 标题 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">分享学习成果</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* 预览卡片 */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white mb-6">
              <p className="font-bold text-lg mb-2">我的学习成果</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <p className="text-2xl font-bold">{data?.streak || 7}</p>
                  <p className="text-xs opacity-90">连续天数</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <p className="text-2xl font-bold">{data?.score || 1280}</p>
                  <p className="text-xs opacity-90">累计积分</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <p className="text-2xl font-bold">{data?.wordsLearned || 186}</p>
                  <p className="text-xs opacity-90">掌握单词</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                  <p className="text-2xl font-bold">{data?.studyTime || 28}</p>
                  <p className="text-xs opacity-90">今日时长(分)</p>
                </div>
              </div>
            </div>

            {/* 分享选项 */}
            <div className="space-y-3">
              {/* 生成海报 */}
              <button
                onClick={generatePoster}
                disabled={generating}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FaImage className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">生成分享海报</p>
                    <p className="text-xs text-gray-500">保存图片分享到小红书</p>
                  </div>
                </div>
                {generating ? (
                  <span className="text-xs text-purple-600">生成中...</span>
                ) : (
                  <FaDownload className="text-purple-600" />
                )}
              </button>

              {/* 复制文案 */}
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <FaLink className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">复制分享文案</p>
                    <p className="text-xs text-gray-500">一键复制推广文案</p>
                  </div>
                </div>
                {copied ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <span className="text-xs text-green-600">复制</span>
                )}
              </button>

              {/* 微信分享 */}
              <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <FaWeixin className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">微信好友</p>
                    <p className="text-xs text-gray-500">分享给微信好友</p>
                  </div>
                </div>
                <FaQrcode className="text-green-600" />
              </button>
            </div>

            {/* 提示 */}
            <p className="text-xs text-gray-500 text-center mt-4">
              分享学习成果，邀请好友一起学习可获得额外积分奖励
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}