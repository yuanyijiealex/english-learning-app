'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaGift, FaCrown, FaCheck, FaTimes } from 'react-icons/fa'

export default function RedeemPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // 格式化输入 - 自动大写，每4位加横线
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length > 16) value = value.slice(0, 16)

    // 每4位加一个横线
    const formatted = value.match(/.{1,4}/g)?.join('-') || value
    setCode(formatted)
  }

  // 验证兑换码
  const handleRedeem = async () => {
    if (code.replace(/-/g, '').length !== 16) {
      setStatus('error')
      setMessage('请输入完整的16位兑换码')
      return
    }

    setLoading(true)
    setStatus('idle')

    // 模拟验证过程
    setTimeout(() => {
      // 模拟兑换码验证
      const validCodes = [
        'XHSE-NGLI-SH20-2401', // 小红书英语2024年1月
        'PREM-IUM3-9RMB-2024', // 高级会员39元
        'TEST-CODE-1234-5678', // 测试码
      ]

      const cleanCode = code.replace(/-/g, '')
      const isValid = validCodes.some(vc => vc.replace(/-/g, '') === cleanCode)

      if (isValid) {
        // 激活成功
        setStatus('success')
        setMessage('恭喜！会员激活成功')

        // 更新用户状态
        const user = JSON.parse(localStorage.getItem('demo_user') || '{}')
        user.subscription_status = 'premium'
        user.redeem_code = code
        user.activated_at = new Date().toISOString()
        localStorage.setItem('demo_user', JSON.stringify(user))

        // 3秒后跳转
        setTimeout(() => {
          router.push('/profile')
        }, 3000)
      } else {
        // 兑换码无效
        setStatus('error')
        setMessage('兑换码无效或已被使用')
      }

      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
        >
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
              <FaGift className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold mb-2">激活会员</h1>
            <p className="text-gray-600">输入兑换码升级为PRO会员</p>
          </div>

          {/* 兑换码输入 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兑换码
              </label>
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={code}
                onChange={handleCodeChange}
                className={`w-full px-4 py-3 text-center text-lg font-mono border-2 rounded-lg focus:outline-none transition-colors ${
                  status === 'error'
                    ? 'border-red-500 bg-red-50'
                    : status === 'success'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 focus:border-purple-500'
                }`}
                disabled={loading || status === 'success'}
                maxLength={19} // 16位 + 3个横线
              />
              <p className="text-xs text-gray-500 mt-2">
                在小红书购买后获得的16位兑换码
              </p>
            </div>

            {/* 状态提示 */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  status === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {status === 'error' ? (
                  <FaTimes className="flex-shrink-0" />
                ) : (
                  <FaCheck className="flex-shrink-0" />
                )}
                <span className="text-sm">{message}</span>
              </motion.div>
            )}

            {/* 激活按钮 */}
            <button
              onClick={handleRedeem}
              disabled={loading || status === 'success' || code.length < 19}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                loading || status === 'success' || code.length < 19
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  验证中...
                </span>
              ) : status === 'success' ? (
                '激活成功！'
              ) : (
                '立即激活'
              )}
            </button>
          </div>

          {/* 会员权益 */}
          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <FaCrown className="text-yellow-500" />
              PRO会员权益
            </h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>无限制观看所有视频</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>解锁全部AI闯关关卡</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>无限制词汇收藏</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>专属学习数据分析</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>永久有效，一次购买终身使用</span>
              </li>
            </ul>
          </div>

          {/* 底部链接 */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              还没有兑换码？
            </p>
            <a
              href="https://xiaohongshu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-purple-600 hover:underline text-sm font-medium"
            >
              去小红书购买 →
            </a>
          </div>

          {/* 返回按钮 */}
          <button
            onClick={() => router.back()}
            className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
          >
            返回
          </button>
        </motion.div>
      </div>
    </div>
  )
}