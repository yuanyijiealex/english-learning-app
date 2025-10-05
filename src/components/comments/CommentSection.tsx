'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaComment, FaHeart, FaReply, FaUser,
  FaPaperPlane, FaFlag, FaEllipsisV
} from 'react-icons/fa'

interface Comment {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  likes: number
  isLiked: boolean
  replies: Comment[]
  createdAt: string
  videoId: string
}

interface CommentSectionProps {
  videoId: string
  isOpen: boolean
  onClose: () => void
}

export default function CommentSection({ videoId, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadComments()
    }
  }, [isOpen, videoId])

  const loadComments = () => {
    // 模拟评论数据
    const mockComments: Comment[] = [
      {
        id: '1',
        userId: 'u1',
        username: '小雅学英语',
        avatar: 'https://ui-avatars.com/api/?name=Emma&background=667eea&color=fff',
        content: '这个视频的场景很实用！咖啡店点单经常用到这些表达 ☕',
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: '1-1',
            userId: 'u2',
            username: '小明同学',
            avatar: 'https://ui-avatars.com/api/?name=Ming&background=f093fb&color=fff',
            content: '同意！我上次去星巴克就用上了 "Can I get..." 这个句型',
            likes: 3,
            isLiked: false,
            replies: [],
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            videoId
          }
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        videoId
      },
      {
        id: '2',
        userId: 'u3',
        username: '露西英语角',
        avatar: 'https://ui-avatars.com/api/?name=Lucy&background=764ba2&color=fff',
        content: '重点词汇总结：\n1. latte - 拿铁\n2. extra shot - 加浓\n3. to go - 外带\n很实用的总结！',
        likes: 28,
        isLiked: true,
        replies: [],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        videoId
      }
    ]

    // 从localStorage加载真实评论
    const savedComments = localStorage.getItem(`comments_${videoId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    } else {
      setComments(mockComments)
    }
  }

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments)
    localStorage.setItem(`comments_${videoId}`, JSON.stringify(updatedComments))
  }

  const handleSendComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `c-${Date.now()}`,
      userId: 'current-user',
      username: '我',
      avatar: 'https://ui-avatars.com/api/?name=Me&background=667eea&color=fff',
      content: newComment,
      likes: 0,
      isLiked: false,
      replies: [],
      createdAt: new Date().toISOString(),
      videoId
    }

    saveComments([comment, ...comments])
    setNewComment('')
  }

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `r-${Date.now()}`,
      userId: 'current-user',
      username: '我',
      avatar: 'https://ui-avatars.com/api/?name=Me&background=667eea&color=fff',
      content: replyContent,
      likes: 0,
      isLiked: false,
      replies: [],
      createdAt: new Date().toISOString(),
      videoId
    }

    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply]
        }
      }
      return comment
    })

    saveComments(updatedComments)
    setReplyContent('')
    setReplyTo(null)
  }

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    const updatedComments = comments.map(comment => {
      if (!isReply && comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        }
      } else if (isReply && parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked
              }
            }
            return reply
          })
        }
      }
      return comment
    })

    saveComments(updatedComments)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-50"
          style={{ height: '70vh' }}
        >
          {/* 头部 */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-2">
              <FaComment className="text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">评论 ({comments.length})</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
            >
              ×
            </button>
          </div>

          {/* 评论列表 */}
          <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100% - 120px)' }}>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    {/* 主评论 */}
                    <div className="flex gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{comment.username}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">{comment.content}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <button
                            onClick={() => handleLike(comment.id)}
                            className={`flex items-center gap-1 ${comment.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                          >
                            <FaHeart className={comment.isLiked ? 'fill-current' : ''} />
                            {comment.likes > 0 && comment.likes}
                          </button>
                          <button
                            onClick={() => setReplyTo(comment.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-purple-600"
                          >
                            <FaReply />
                            回复
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <FaEllipsisV />
                          </button>
                        </div>

                        {/* 回复输入框 */}
                        {replyTo === comment.id && (
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={`回复 ${comment.username}...`}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-purple-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleReply(comment.id)}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <FaPaperPlane />
                            </button>
                            <button
                              onClick={() => {
                                setReplyTo(null)
                                setReplyContent('')
                              }}
                              className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                              取消
                            </button>
                          </div>
                        )}

                        {/* 回复列表 */}
                        {comment.replies.length > 0 && (
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-100">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex gap-2">
                                <img
                                  src={reply.avatar}
                                  alt={reply.username}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-xs">{reply.username}</span>
                                    <span className="text-xs text-gray-500">{formatTime(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-xs text-gray-700 mb-1">{reply.content}</p>
                                  <button
                                    onClick={() => handleLike(reply.id, true, comment.id)}
                                    className={`text-xs flex items-center gap-1 ${reply.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                                  >
                                    <FaHeart className={reply.isLiked ? 'fill-current' : ''} size={12} />
                                    {reply.likes > 0 && reply.likes}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaComment className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">暂无评论</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">来发表第一条评论吧！</p>
              </div>
            )}
          </div>

          {/* 评论输入框 */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Me&background=667eea&color=fff"
                alt="Me"
                className="w-8 h-8 rounded-full"
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}