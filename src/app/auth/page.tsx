'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { FaEnvelope, FaLock, FaUser, FaWeixin, FaGithub } from 'react-icons/fa'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // 登录
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        // 登录成功，跳转到首页
        router.push('/')
      } else {
        // 注册
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) throw error

        // 创建用户资料
        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: data.user.id,
              username,
              avatar_url: `https://ui-avatars.com/api/?name=${username}&background=667eea&color=fff`
            } as any)

          if (profileError) {
            console.error('Error creating profile:', profileError)
          }
        }

        // 注册成功
        alert('注册成功！请查看邮箱验证')
      }
    } catch (err: any) {
      setError(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // 演示账号快速登录
  const handleDemoLogin = async () => {
    setEmail('demo@example.com')
    setPassword('demo123456')
    setLoading(true)

    // 模拟登录
    setTimeout(() => {
      localStorage.setItem('demo_user', JSON.stringify({
        id: 'demo-user',
        email: 'demo@example.com',
        username: '体验用户',
        total_points: 0
      }))
      router.push('/')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Scene English
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? '登录继续学习' : '注册开启学习之旅'}
          </p>
        </div>

        {/* 切换标签 */}
        <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md transition-all ${
              isLogin
                ? 'bg-white shadow-sm text-purple-600 font-semibold'
                : 'text-gray-500'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md transition-all ${
              !isLogin
                ? 'bg-white shadow-sm text-purple-600 font-semibold'
                : 'text-gray-500'
            }`}
          >
            注册
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        {/* 快速登录 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或者</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg transition-colors"
            >
              ⚡ 演示账号快速体验
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-3 rounded-lg transition-colors">
                <FaWeixin /> 微信
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors">
                <FaGithub /> GitHub
              </button>
            </div>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? (
            <p>
              还没有账号？
              <button
                onClick={() => setIsLogin(false)}
                className="text-purple-600 hover:underline ml-1"
              >
                立即注册
              </button>
            </p>
          ) : (
            <p>
              已有账号？
              <button
                onClick={() => setIsLogin(true)}
                className="text-purple-600 hover:underline ml-1"
              >
                立即登录
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}