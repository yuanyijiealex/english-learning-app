'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FaStickyNote, FaClock, FaTag, FaSearch,
  FaDownload, FaTrash, FaEdit, FaFilter
} from 'react-icons/fa'
import NoteEditor from '@/components/notes/NoteEditor'

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

export default function NotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'video'>('date')

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    filterNotes()
  }, [notes, searchQuery, selectedTag, sortBy])

  const loadNotes = () => {
    const saved = localStorage.getItem('study_notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }

  const filterNotes = () => {
    let filtered = [...notes]

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // 标签过滤
    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag))
    }

    // 排序
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else {
      filtered.sort((a, b) => a.videoTitle.localeCompare(b.videoTitle))
    }

    setFilteredNotes(filtered)
  }

  const getAllTags = () => {
    const tagsSet = new Set<string>()
    notes.forEach(note => {
      note.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet)
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('确定要删除这条笔记吗？')) {
      const updatedNotes = notes.filter(n => n.id !== noteId)
      setNotes(updatedNotes)
      localStorage.setItem('study_notes', JSON.stringify(updatedNotes))
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowEditor(true)
  }

  const handleSaveNote = (note: Note) => {
    loadNotes() // 重新加载笔记
    setEditingNote(null)
    setShowEditor(false)
  }

  const exportNotes = () => {
    const content = filteredNotes.map(note => {
      const timestamp = note.timestamp ? `[${formatTime(note.timestamp)}]` : ''
      const tags = note.tags.length > 0 ? `\n标签: ${note.tags.join(', ')}` : ''
      return `## ${note.videoTitle} ${timestamp}
${note.content}${tags}
更新时间: ${new Date(note.updatedAt).toLocaleString('zh-CN')}
---`
    }).join('\n\n')

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-notes-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
              <h1 className="text-xl font-bold">学习笔记</h1>
            </div>
            <button
              onClick={exportNotes}
              disabled={filteredNotes.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaDownload />
              导出笔记
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 搜索和筛选栏 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="搜索笔记内容、视频标题或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* 排序选项 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'video')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="date">按时间排序</option>
              <option value="video">按视频排序</option>
            </select>
          </div>

          {/* 标签筛选 */}
          {getAllTags().length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <FaFilter className="text-gray-500" />
                <span className="text-sm font-medium">标签筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !selectedTag
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                {getAllTags().map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      tag === selectedTag
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 统计信息 */}
          <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm text-gray-600">
            <span>总计 {notes.length} 条笔记</span>
            {searchQuery || selectedTag ? (
              <span>筛选结果 {filteredNotes.length} 条</span>
            ) : null}
          </div>
        </div>

        {/* 笔记列表 */}
        {filteredNotes.length > 0 ? (
          <div className="grid gap-4">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{note.videoTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {note.timestamp !== undefined && (
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {formatTime(note.timestamp)}
                        </span>
                      )}
                      <span>{new Date(note.updatedAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-3">{note.content}</p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        onClick={() => setSelectedTag(tag)}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs cursor-pointer hover:bg-purple-200"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <FaStickyNote className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {searchQuery || selectedTag ? '没有找到符合条件的笔记' : '还没有学习笔记'}
            </p>
            <p className="text-sm text-gray-400">
              在视频学习时点击笔记按钮，记录重要知识点
            </p>
          </div>
        )}
      </div>

      {/* 笔记编辑器弹窗 */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <NoteEditor
            videoId={editingNote?.videoId || 'default'}
            videoTitle={editingNote?.videoTitle || '学习笔记'}
            existingNote={editingNote || undefined}
            onClose={() => {
              setShowEditor(false)
              setEditingNote(null)
            }}
            onSave={handleSaveNote}
          />
        </div>
      )}
    </div>
  )
}