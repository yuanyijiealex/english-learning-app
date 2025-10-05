'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEdit, FaSave, FaTimes, FaTrash, FaPlay } from 'react-icons/fa'
import VideoAnalyzer from './VideoAnalyzer'

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

interface VideoEditorProps {
  video: Video
  onSave: (video: Video) => void
  onDelete: (id: string) => void
  onCancel: () => void
}

export default function VideoEditor({ video, onSave, onDelete, onCancel }: VideoEditorProps) {
  const [editedVideo, setEditedVideo] = useState<Video>(video)
  const [keyPointInput, setKeyPointInput] = useState('')
  const [showAnalyzer, setShowAnalyzer] = useState(false)

  const handleAddKeyPoint = () => {
    if (keyPointInput.trim()) {
      setEditedVideo({
        ...editedVideo,
        keyPoints: [...(editedVideo.keyPoints || []), keyPointInput.trim()]
      })
      setKeyPointInput('')
    }
  }

  const handleRemoveKeyPoint = (index: number) => {
    const newKeyPoints = [...(editedVideo.keyPoints || [])]
    newKeyPoints.splice(index, 1)
    setEditedVideo({ ...editedVideo, keyPoints: newKeyPoints })
  }

  const handleSave = () => {
    onSave(editedVideo)
  }

  const handleAnalysisComplete = (analysis: any) => {
    // 将AI分析结果应用到视频
    setEditedVideo({
      ...editedVideo,
      keyPoints: analysis.keyPhrases,
      difficulty: analysis.difficulty
    })
    setShowAnalyzer(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">编辑视频信息</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧：视频预览 */}
        <div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video
              src={editedVideo.url}
              controls
              className="w-full h-full"
            />
          </div>
          <div className="flex gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaPlay /> {editedVideo.views || 0} 播放
            </span>
            <span>•</span>
            <span>{Math.floor(editedVideo.duration / 60)}:{String(editedVideo.duration % 60).padStart(2, '0')}</span>
          </div>
        </div>

        {/* 右侧：编辑表单 */}
        <div className="space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium mb-1">视频标题</label>
            <input
              type="text"
              value={editedVideo.title}
              onChange={(e) => setEditedVideo({ ...editedVideo, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-1">视频描述</label>
            <textarea
              value={editedVideo.description || ''}
              onChange={(e) => setEditedVideo({ ...editedVideo, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="输入视频的场景描述..."
            />
          </div>

          {/* 分类和难度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select
                value={editedVideo.category}
                onChange={(e) => setEditedVideo({ ...editedVideo, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="daily">日常对话</option>
                <option value="business">商务英语</option>
                <option value="travel">旅游英语</option>
                <option value="academic">学术英语</option>
                <option value="culture">文化习俗</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">难度</label>
              <select
                value={editedVideo.difficulty}
                onChange={(e) => setEditedVideo({ ...editedVideo, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="beginner">初级</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
          </div>

          {/* 关键知识点 */}
          <div>
            <label className="block text-sm font-medium mb-1">关键知识点</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keyPointInput}
                onChange={(e) => setKeyPointInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyPoint()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="添加知识点..."
              />
              <button
                onClick={handleAddKeyPoint}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedVideo.keyPoints?.map((point, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {point}
                  <button
                    onClick={() => handleRemoveKeyPoint(index)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 字幕文本 */}
          <div>
            <label className="block text-sm font-medium mb-1">字幕文本（可选）</label>
            <textarea
              value={editedVideo.transcript || ''}
              onChange={(e) => setEditedVideo({ ...editedVideo, transcript: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="粘贴视频的英文字幕..."
            />
          </div>

          {/* AI分析按钮 */}
          <div>
            <button
              type="button"
              onClick={() => setShowAnalyzer(!showAnalyzer)}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {showAnalyzer ? '隐藏AI分析' : '使用AI分析内容'}
            </button>
          </div>
        </div>

        {/* AI分析面板 */}
        {showAnalyzer && (
          <div className="border-t pt-4">
            <VideoAnalyzer
              videoTitle={editedVideo.title}
              videoDescription={editedVideo.description}
              transcript={editedVideo.transcript}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => onDelete(video.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <FaTrash /> 删除视频
        </button>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <FaSave /> 保存修改
          </button>
        </div>
      </div>
    </motion.div>
  )
}