'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaStickyNote, FaClock, FaTimes, FaSave,
  FaHighlighter, FaTag, FaDownload
} from 'react-icons/fa'

interface Note {
  id: string
  videoId: string
  videoTitle: string
  timestamp?: number
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface NoteEditorProps {
  videoId: string
  videoTitle: string
  currentTime?: number
  onClose?: () => void
  onSave?: (note: Note) => void
  existingNote?: Note
}

export default function NoteEditor({
  videoId,
  videoTitle,
  currentTime = 0,
  onClose,
  onSave,
  existingNote
}: NoteEditorProps) {
  const [content, setContent] = useState(existingNote?.content || '')
  const [tags, setTags] = useState<string[]>(existingNote?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [useTimestamp, setUseTimestamp] = useState(!!existingNote?.timestamp)
  const [timestamp, setTimestamp] = useState(existingNote?.timestamp || currentTime)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    const note: Note = {
      id: existingNote?.id || `note-${Date.now()}`,
      videoId,
      videoTitle,
      timestamp: useTimestamp ? timestamp : undefined,
      content,
      tags,
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 保存到localStorage
    const savedNotes = JSON.parse(localStorage.getItem('study_notes') || '[]')

    if (existingNote) {
      // 更新现有笔记
      const index = savedNotes.findIndex((n: Note) => n.id === existingNote.id)
      if (index > -1) {
        savedNotes[index] = note
      }
    } else {
      // 添加新笔记
      savedNotes.unshift(note)
    }

    localStorage.setItem('study_notes', JSON.stringify(savedNotes))

    if (onSave) onSave(note)
    if (onClose) onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    >
      {/* 头部 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaStickyNote />
            <div>
              <h3 className="font-bold">{existingNote ? '编辑笔记' : '添加笔记'}</h3>
              <p className="text-xs opacity-90">{videoTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* 时间戳选项 */}
      <div className="p-4 border-b">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={useTimestamp}
            onChange={(e) => setUseTimestamp(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-500" />
            <span className="text-sm">添加时间戳</span>
            {useTimestamp && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                {formatTime(timestamp)}
              </span>
            )}
          </div>
        </label>
      </div>

      {/* 笔记内容 */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="记录你的学习笔记..."
          className="w-full h-full min-h-[200px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
          autoFocus
        />
      </div>

      {/* 标签 */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 mb-3">
          <FaTag className="text-gray-500" />
          <span className="text-sm font-medium">标签</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="添加标签..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
          >
            添加
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FaSave />
          保存笔记
        </button>
      </div>
    </motion.div>
  )
}