'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaStar, FaFolder, FaFolderOpen, FaPlus,
  FaPlay, FaClock, FaTag, FaTrash,
  FaEdit, FaSearch, FaFilter, FaHeart
} from 'react-icons/fa'
import { Video } from '@/types/video'

interface Collection {
  id: string
  name: string
  description: string
  icon: string
  color: string
  videoIds: string[]
  createdAt: string
  updatedAt: string
}

interface FavoriteVideo extends Video {
  collectionIds: string[]
  favoritedAt: string
  notes?: string
  lastWatchedAt?: string
  watchProgress?: number
}

export default function FavoritesPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [favoriteVideos, setFavoriteVideos] = useState<FavoriteVideo[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: '⭐',
    color: 'from-purple-500 to-pink-500'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // 加载收藏夹
    const savedCollections = localStorage.getItem('video_collections')
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections))
    } else {
      // 默认收藏夹
      const defaultCollections: Collection[] = [
        {
          id: 'default',
          name: '默认收藏',
          description: '我的收藏视频',
          icon: '⭐',
          color: 'from-yellow-400 to-orange-500',
          videoIds: ['v1', 'v2'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'daily',
          name: '日常对话',
          description: '日常场景英语对话',
          icon: '💬',
          color: 'from-blue-500 to-cyan-500',
          videoIds: ['v1', 'v3'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'business',
          name: '商务英语',
          description: '商务场景相关',
          icon: '💼',
          color: 'from-gray-600 to-gray-800',
          videoIds: ['v2'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setCollections(defaultCollections)
      localStorage.setItem('video_collections', JSON.stringify(defaultCollections))
    }

    // 加载收藏的视频
    const mockVideos: FavoriteVideo[] = [
      {
        id: 'v1',
        title: '咖啡店对话',
        category: 'daily',
        difficulty: 2,
        duration: 180,
        thumbnail: '/api/placeholder/400/300',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        accent: 'US' as const,
        transcript_en: [],
        transcript_cn: [],
        checkpoints: [],
        view_count: 0,
        created_at: new Date().toISOString(),
        collectionIds: ['default', 'daily'],
        favoritedAt: new Date(Date.now() - 86400000).toISOString(),
        notes: '重点学习点单用语',
        lastWatchedAt: new Date(Date.now() - 3600000).toISOString(),
        watchProgress: 65
      },
      {
        id: 'v2',
        title: '商务会议要点',
        category: 'business',
        difficulty: 3,
        duration: 240,
        thumbnail: '/api/placeholder/400/300',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        accent: 'US' as const,
        transcript_en: [],
        transcript_cn: [],
        checkpoints: [],
        view_count: 0,
        created_at: new Date().toISOString(),
        collectionIds: ['default', 'business'],
        favoritedAt: new Date(Date.now() - 172800000).toISOString(),
        lastWatchedAt: new Date(Date.now() - 7200000).toISOString(),
        watchProgress: 30
      },
      {
        id: 'v3',
        title: '机场值机流程',
        category: 'travel',
        difficulty: 3,
        duration: 210,
        thumbnail: '/api/placeholder/400/300',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        accent: 'US' as const,
        transcript_en: [],
        transcript_cn: [],
        checkpoints: [],
        view_count: 0,
        created_at: new Date().toISOString(),
        collectionIds: ['daily'],
        favoritedAt: new Date(Date.now() - 259200000).toISOString(),
        watchProgress: 100
      }
    ]

    const savedVideos = localStorage.getItem('favorite_videos')
    if (savedVideos) {
      setFavoriteVideos(JSON.parse(savedVideos))
    } else {
      setFavoriteVideos(mockVideos)
      localStorage.setItem('favorite_videos', JSON.stringify(mockVideos))
    }
  }

  const handleCreateCollection = () => {
    if (!newCollection.name) return

    const collection: Collection = {
      id: `col-${Date.now()}`,
      ...newCollection,
      videoIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedCollections = [...collections, collection]
    setCollections(updatedCollections)
    localStorage.setItem('video_collections', JSON.stringify(updatedCollections))

    setShowNewCollectionModal(false)
    setNewCollection({
      name: '',
      description: '',
      icon: '⭐',
      color: 'from-purple-500 to-pink-500'
    })
  }

  const handleDeleteCollection = (collectionId: string) => {
    if (collectionId === 'default') {
      alert('默认收藏夹不能删除')
      return
    }

    if (confirm('确定要删除这个收藏夹吗？')) {
      const updatedCollections = collections.filter(c => c.id !== collectionId)
      setCollections(updatedCollections)
      localStorage.setItem('video_collections', JSON.stringify(updatedCollections))

      // 从视频中移除该收藏夹ID
      const updatedVideos = favoriteVideos.map(v => ({
        ...v,
        collectionIds: v.collectionIds.filter(id => id !== collectionId)
      }))
      setFavoriteVideos(updatedVideos)
      localStorage.setItem('favorite_videos', JSON.stringify(updatedVideos))
    }
  }

  const handleRemoveFromCollection = (videoId: string, collectionId: string) => {
    const updatedVideos = favoriteVideos.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          collectionIds: v.collectionIds.filter(id => id !== collectionId)
        }
      }
      return v
    })

    setFavoriteVideos(updatedVideos)
    localStorage.setItem('favorite_videos', JSON.stringify(updatedVideos))

    // 更新收藏夹中的视频ID列表
    const updatedCollections = collections.map(c => {
      if (c.id === collectionId) {
        return {
          ...c,
          videoIds: c.videoIds.filter(id => id !== videoId),
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    setCollections(updatedCollections)
    localStorage.setItem('video_collections', JSON.stringify(updatedCollections))
  }

  const getFilteredVideos = () => {
    let filtered = [...favoriteVideos]

    // 按收藏夹筛选
    if (selectedCollection) {
      filtered = filtered.filter(v => v.collectionIds.includes(selectedCollection))
    }

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 按收藏时间排序
    filtered.sort((a, b) => new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime())

    return filtered
  }

  const filteredVideos = getFilteredVideos()

  const iconOptions = ['⭐', '💬', '💼', '🎯', '📚', '🎬', '🌟', '❤️', '🔥', '📖']
  const colorOptions = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-yellow-400 to-orange-500',
    'from-red-500 to-pink-500',
    'from-gray-600 to-gray-800'
  ]

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
                <FaStar /> 视频收藏
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {viewMode === 'grid' ? '📋' : '📱'}
              </button>
              <button
                onClick={() => setShowNewCollectionModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FaPlus />
                新建收藏夹
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧收藏夹列表 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FaFolder className="text-purple-600" />
                收藏夹
              </h3>

              {/* 全部收藏 */}
              <button
                onClick={() => setSelectedCollection(null)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors flex items-center gap-3 ${
                  !selectedCollection ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                }`}
              >
                <FaHeart className="text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">全部收藏</p>
                  <p className="text-xs text-gray-600">{favoriteVideos.length} 个视频</p>
                </div>
              </button>

              {/* 收藏夹列表 */}
              <div className="space-y-2">
                {collections.map(collection => {
                  const videoCount = favoriteVideos.filter(v =>
                    v.collectionIds.includes(collection.id)
                  ).length

                  return (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollection(collection.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCollection === collection.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{collection.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-xs text-gray-600">{videoCount} 个视频</p>
                        </div>
                        {collection.id !== 'default' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCollection(collection.id)
                            }}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 右侧视频列表 */}
          <div className="flex-1">
            {/* 搜索栏 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索收藏的视频..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* 视频网格/列表 */}
            {filteredVideos.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
              }>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                      viewMode === 'list' ? 'flex gap-4 p-4' : ''
                    }`}
                  >
                    {/* 缩略图 */}
                    <div className={viewMode === 'grid'
                      ? 'relative aspect-video bg-gray-200'
                      : 'relative w-48 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0'
                    }>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <button
                        onClick={() => router.push(`/video/${video.id}`)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30"
                      >
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <FaPlay className="text-purple-600 ml-1" />
                        </div>
                      </button>
                      {video.watchProgress !== undefined && video.watchProgress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${video.watchProgress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* 视频信息 */}
                    <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                      <h3 className="font-semibold mb-1">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {video.notes || '暂无描述'}
                      </p>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {video.category === 'daily' ? '日常' :
                           video.category === 'business' ? '商务' :
                           video.category === 'travel' ? '旅行' : '学术'}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {video.difficulty <= 2 ? '初级' :
                           video.difficulty <= 3 ? '中级' : '高级'}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                          <FaClock />
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* 笔记 */}
                      {video.notes && (
                        <p className="text-xs text-gray-500 mb-2 italic">
                          📝 {video.notes}
                        </p>
                      )}

                      {/* 所属收藏夹 */}
                      <div className="flex flex-wrap gap-1">
                        {video.collectionIds.map(colId => {
                          const col = collections.find(c => c.id === colId)
                          if (!col) return null
                          return (
                            <span
                              key={colId}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1"
                            >
                              {col.icon} {col.name}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFromCollection(video.id, colId)
                                }}
                                className="ml-1 text-gray-400 hover:text-red-500"
                              >
                                ×
                              </button>
                            </span>
                          )
                        })}
                      </div>

                      {/* 收藏时间 */}
                      <p className="text-xs text-gray-400 mt-2">
                        收藏于 {new Date(video.favoritedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">
                  {selectedCollection ? '该收藏夹还没有视频' : '还没有收藏任何视频'}
                </p>
                <p className="text-sm text-gray-400">
                  在视频播放时点击收藏按钮，将喜欢的视频添加到收藏夹
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 新建收藏夹模态框 */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">新建收藏夹</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">名称</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="例如：我的最爱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  rows={2}
                  placeholder="描述这个收藏夹..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">图标</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewCollection({ ...newCollection, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                        newCollection.icon === icon
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">颜色</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCollection({ ...newCollection, color })}
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} ${
                        newCollection.color === color
                          ? 'ring-2 ring-purple-500 ring-offset-2'
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewCollectionModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                创建
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}