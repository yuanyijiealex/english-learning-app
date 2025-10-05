'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaUsers, FaVideo, FaChartLine, FaGift,
  FaCopy, FaDownload, FaTrash, FaPlus,
  FaEdit, FaSearch, FaBan, FaCheckCircle,
  FaEye, FaLock, FaUnlock, FaTrophy, FaCrown, FaTimes
} from 'react-icons/fa'
import VideoUploader from '@/components/admin/VideoUploader'
import VideoEditor from '@/components/admin/VideoEditor'

interface RedeemCode {
  id: string
  code: string
  status: 'unused' | 'used'
  createdAt: Date
  usedAt?: Date
  usedBy?: string
}

interface User {
  id: string
  username: string
  email: string
  avatar: string
  joinDate: string
  subscriptionStatus: 'free' | 'premium'
  status: 'active' | 'banned'
  totalPoints: number
  videosWatched: number
  lastActiveAt: string
}

interface Video {
  id: string
  title: string
  description?: string
  category: string
  difficulty: string
  duration: number
  url: string
  thumbnail: string
  keyPoints?: string[]
  transcript?: string
  uploadedAt: string
  views: number
  likes: number
  status: 'published' | 'draft'
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [codes, setCodes] = useState<RedeemCode[]>([])
  const [batchSize, setBatchSize] = useState(10)
  const [users, setUsers] = useState<User[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  useEffect(() => {
    // 加载已有的兑换码
    const savedCodes = localStorage.getItem('redeem_codes')
    if (savedCodes) {
      setCodes(JSON.parse(savedCodes))
    }

    // 加载模拟用户数据
    const mockUsers: User[] = [
      {
        id: '1',
        username: '小雅学英语',
        email: 'emma@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Emma&background=667eea&color=fff',
        joinDate: '2024-01-15',
        subscriptionStatus: 'premium',
        status: 'active',
        totalPoints: 1280,
        videosWatched: 42,
        lastActiveAt: '2024-12-08T10:30:00'
      },
      {
        id: '2',
        username: '小明同学',
        email: 'xiaoming@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Ming&background=f093fb&color=fff',
        joinDate: '2024-02-20',
        subscriptionStatus: 'free',
        status: 'active',
        totalPoints: 580,
        videosWatched: 15,
        lastActiveAt: '2024-12-08T09:15:00'
      },
      {
        id: '3',
        username: '露西英语角',
        email: 'lucy@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Lucy&background=764ba2&color=fff',
        joinDate: '2024-03-10',
        subscriptionStatus: 'premium',
        status: 'active',
        totalPoints: 2150,
        videosWatched: 78,
        lastActiveAt: '2024-12-07T22:45:00'
      },
      {
        id: '4',
        username: '违规用户',
        email: 'banned@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Banned&background=dc3545&color=fff',
        joinDate: '2024-04-05',
        subscriptionStatus: 'free',
        status: 'banned',
        totalPoints: 120,
        videosWatched: 5,
        lastActiveAt: '2024-11-20T15:20:00'
      }
    ]
    setUsers(mockUsers)

    // 加载模拟视频数据
    const mockVideos: Video[] = [
      {
        id: '1',
        title: 'Coffee Shop Conversation',
        description: '学习在咖啡店点单的常用对话',
        category: 'daily',
        difficulty: 'beginner',
        duration: 180,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: '/api/placeholder/400/300',
        keyPoints: ['点单用语', '价格询问', '礼貌用语'],
        uploadedAt: '2024-12-01T10:00:00',
        views: 1523,
        likes: 89,
        status: 'published'
      },
      {
        id: '2',
        title: 'Business Meeting Essentials',
        description: '商务会议必备英语表达',
        category: 'business',
        difficulty: 'intermediate',
        duration: 240,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: '/api/placeholder/400/300',
        keyPoints: ['会议开场', '表达观点', '总结发言'],
        uploadedAt: '2024-12-03T14:30:00',
        views: 892,
        likes: 67,
        status: 'published'
      },
      {
        id: '3',
        title: 'Airport Check-in Process',
        description: '机场值机全流程对话',
        category: 'travel',
        difficulty: 'intermediate',
        duration: 210,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: '/api/placeholder/400/300',
        keyPoints: ['值机手续', '行李托运', '安检对话'],
        uploadedAt: '2024-12-05T09:15:00',
        views: 456,
        likes: 34,
        status: 'draft'
      }
    ]
    setVideos(mockVideos)
  }, [])

  // 生成随机兑换码
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 16; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
      if ((i + 1) % 4 === 0 && i < 15) code += '-'
    }
    return code
  }

  // 批量生成兑换码
  const handleGenerateCodes = () => {
    const newCodes: RedeemCode[] = []
    for (let i = 0; i < batchSize; i++) {
      newCodes.push({
        id: Date.now().toString() + i,
        code: generateCode(),
        status: 'unused',
        createdAt: new Date()
      })
    }

    const updatedCodes = [...codes, ...newCodes]
    setCodes(updatedCodes)
    localStorage.setItem('redeem_codes', JSON.stringify(updatedCodes))
  }

  // 复制兑换码
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('兑换码已复制')
  }

  // 导出兑换码
  const exportCodes = () => {
    const unusedCodes = codes.filter(c => c.status === 'unused')
    const csv = 'Code,Status,Created At\n' +
      unusedCodes.map(c => `${c.code},${c.status},${c.createdAt}`).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `redeem-codes-${Date.now()}.csv`
    a.click()
  }

  // 删除兑换码
  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter(c => c.id !== id)
    setCodes(updatedCodes)
    localStorage.setItem('redeem_codes', JSON.stringify(updatedCodes))
  }

  // 用户管理功能
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
        : user
    ))
  }

  const upgradeUserToPremium = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, subscriptionStatus: 'premium' }
        : user
    ))
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 视频管理功能
  const handleVideoUploadComplete = (video: Video) => {
    setVideos([...videos, { ...video, views: 0, likes: 0, status: 'draft' }])
    setShowUploader(false)
  }

  const handleVideoSave = (updatedVideo: Video) => {
    setVideos(videos.map(v => v.id === updatedVideo.id ? updatedVideo : v))
    setEditingVideo(null)
  }

  const handleVideoDelete = (videoId: string) => {
    if (confirm('确定要删除这个视频吗？')) {
      setVideos(videos.filter(v => v.id !== videoId))
      setEditingVideo(null)
    }
  }

  const toggleVideoStatus = (videoId: string) => {
    setVideos(videos.map(video =>
      video.id === videoId
        ? { ...video, status: video.status === 'published' ? 'draft' : 'published' }
        : video
    ))
  }

  // 模拟数据
  const stats = {
    totalUsers: 1523,
    activeUsers: 342,
    premiumUsers: 89,
    totalVideos: 42,
    totalRevenue: 3561,
    todayRevenue: 279,
    conversionRate: 5.8,
    avgWatchTime: 28
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">管理后台</h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              返回前台
            </button>
          </div>

          {/* 标签页 */}
          <div className="flex gap-4 mt-4">
            {['overview', 'codes', 'users', 'videos'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab === 'overview' && '数据概览'}
                {tab === 'codes' && '兑换码管理'}
                {tab === 'users' && '用户管理'}
                {tab === 'videos' && '视频管理'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 数据概览 */}
        {activeTab === 'overview' && (
          <div>
            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <FaUsers className="text-3xl text-purple-600" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">总用户数</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <FaChartLine className="text-3xl text-green-600" />
                  <span className="text-xs text-green-600">+23%</span>
                </div>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-sm text-gray-600">日活跃用户</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <FaGift className="text-3xl text-yellow-500" />
                  <span className="text-xs text-green-600">+45%</span>
                </div>
                <p className="text-2xl font-bold">¥{stats.totalRevenue}</p>
                <p className="text-sm text-gray-600">本月收入</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <FaVideo className="text-3xl text-blue-600" />
                  <span className="text-xs text-gray-600">{stats.conversionRate}%</span>
                </div>
                <p className="text-2xl font-bold">{stats.premiumUsers}</p>
                <p className="text-sm text-gray-600">付费用户</p>
              </motion.div>
            </div>

            {/* 详细统计 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-bold mb-4">今日数据</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xl font-bold text-purple-600">¥{stats.todayRevenue}</p>
                  <p className="text-sm text-gray-600">今日收入</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">7</p>
                  <p className="text-sm text-gray-600">新增会员</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">{stats.avgWatchTime}分</p>
                  <p className="text-sm text-gray-600">平均学习时长</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">86%</p>
                  <p className="text-sm text-gray-600">完课率</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 兑换码管理 */}
        {activeTab === 'codes' && (
          <div>
            {/* 生成兑换码 */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h2 className="text-lg font-bold mb-4">生成兑换码</h2>
              <div className="flex items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    批量生成数量
                  </label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleGenerateCodes}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> 生成
                </button>
                <button
                  onClick={exportCodes}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaDownload /> 导出CSV
                </button>
              </div>
            </div>

            {/* 兑换码列表 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      兑换码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {codes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        暂无兑换码，请先生成
                      </td>
                    </tr>
                  ) : (
                    codes.map((code) => (
                      <tr key={code.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {code.code}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            code.status === 'used'
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {code.status === 'used' ? '已使用' : '未使用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(code.createdAt).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => copyCode(code.code)}
                            className="text-purple-600 hover:text-purple-700 mr-3"
                          >
                            <FaCopy />
                          </button>
                          <button
                            onClick={() => deleteCode(code.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 用户管理 */}
        {activeTab === 'users' && (
          <div>
            {/* 搜索栏 */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索用户名或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg">
                    总用户: {users.length}
                  </span>
                  <span className="px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                    活跃: {users.filter(u => u.status === 'active').length}
                  </span>
                  <span className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                    会员: {users.filter(u => u.subscriptionStatus === 'premium').length}
                  </span>
                </div>
              </div>
            </div>

            {/* 用户列表 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">加入时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会员状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学习数据</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">账号状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.subscriptionStatus === 'premium'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {user.subscriptionStatus === 'premium' ? 'PRO会员' : '免费用户'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FaVideo className="text-purple-500" />
                            {user.videosWatched}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaTrophy className="text-yellow-500" />
                            {user.totalPoints}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {user.status === 'active' ? '正常' : '封禁'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {user.subscriptionStatus !== 'premium' && (
                            <button
                              onClick={() => upgradeUserToPremium(user.id)}
                              className="text-purple-600 hover:text-purple-700"
                              title="升级为会员"
                            >
                              <FaCrown />
                            </button>
                          )}
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                            title={user.status === 'active' ? '封禁用户' : '解封用户'}
                          >
                            {user.status === 'active' ? <FaBan /> : <FaCheckCircle />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 视频管理 */}
        {activeTab === 'videos' && (
          <div>
            {editingVideo ? (
              <VideoEditor
                video={editingVideo}
                onSave={handleVideoSave}
                onDelete={handleVideoDelete}
                onCancel={() => setEditingVideo(null)}
              />
            ) : showUploader ? (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">上传新视频</h2>
                  <button
                    onClick={() => setShowUploader(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <VideoUploader onUploadComplete={handleVideoUploadComplete} />
              </div>
            ) : (
              <div>
                {/* 视频统计和操作栏 */}
                <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{videos.length}</p>
                        <p className="text-sm text-gray-600">总视频数</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {videos.filter(v => v.status === 'published').length}
                        </p>
                        <p className="text-sm text-gray-600">已发布</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {videos.filter(v => v.status === 'draft').length}
                        </p>
                        <p className="text-sm text-gray-600">草稿</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUploader(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                      <FaPlus /> 上传视频
                    </button>
                  </div>
                </div>

                {/* 视频列表 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* 视频缩略图 */}
                      <div className="relative aspect-video bg-gray-200">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            video.status === 'published'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {video.status === 'published' ? '已发布' : '草稿'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                          {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                        </div>
                      </div>

                      {/* 视频信息 */}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{video.description}</p>

                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {video.category === 'daily' ? '日常对话' :
                             video.category === 'business' ? '商务英语' :
                             video.category === 'travel' ? '旅游英语' :
                             video.category === 'academic' ? '学术英语' : '文化习俗'}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {video.difficulty === 'beginner' ? '初级' :
                             video.difficulty === 'intermediate' ? '中级' : '高级'}
                          </span>
                        </div>

                        {/* 统计数据 */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <FaEye /> {video.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaTrophy /> {video.likes}
                          </span>
                          <span>{new Date(video.uploadedAt).toLocaleDateString('zh-CN')}</span>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingVideo(video)}
                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center justify-center gap-1"
                          >
                            <FaEdit /> 编辑
                          </button>
                          <button
                            onClick={() => toggleVideoStatus(video.id)}
                            className={`flex-1 px-3 py-2 rounded text-sm flex items-center justify-center gap-1 ${
                              video.status === 'published'
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {video.status === 'published' ? <FaLock /> : <FaUnlock />}
                            {video.status === 'published' ? '下架' : '发布'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}