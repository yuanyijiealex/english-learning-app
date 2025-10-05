'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaHeart, FaComment, FaShare, FaStar,
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStickyNote
} from 'react-icons/fa'
import { Video, Subtitle } from '@/types/video'
import NoteEditor from '@/components/notes/NoteEditor'

interface VideoPlayerProps {
  video: Video
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onCheckpoint?: (time: number) => void
}

export default function VideoPlayer({
  video: videoData,
  onSwipeUp,
  onSwipeDown,
  onCheckpoint
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitle, setCurrentSubtitle] = useState<{en: string, cn: string}>({
    en: '',
    cn: ''
  })
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [likes, setLikes] = useState(280)
  const [isLiked, setIsLiked] = useState(false)
  const [showNoteEditor, setShowNoteEditor] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 处理视频播放/暂停
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 处理静音
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // 更新进度
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
      setCurrentTime(video.currentTime)

      // 检查闯关点（从videoData获取checkpoints）
      videoData.checkpoints?.forEach(checkpoint => {
        const checkpointTime = (video.duration * checkpoint.time_percent) / 100
        if (Math.abs(video.currentTime - checkpointTime) < 0.5) {
          onCheckpoint?.(checkpoint.time_percent)
        }
      })

      // 更新字幕（从videoData获取transcript）
      const currentEn = videoData.transcript_en?.find(
        sub => video.currentTime >= sub.start && video.currentTime <= sub.end
      )
      const currentCn = videoData.transcript_cn?.find(
        sub => video.currentTime >= sub.start && video.currentTime <= sub.end
      )

      setCurrentSubtitle({
        en: currentEn?.text || '',
        cn: currentCn?.text || ''
      })
    }

    video.addEventListener('timeupdate', updateProgress)
    return () => video.removeEventListener('timeupdate', updateProgress)
  }, [videoData, onCheckpoint])

  // 处理触摸滑动
  useEffect(() => {
    let startY = 0
    let endY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      endY = e.changedTouches[0].clientY
      const diff = startY - endY

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart)
      container.addEventListener('touchend', handleTouchEnd)

      return () => {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [onSwipeUp, onSwipeDown])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden"
      onClick={togglePlay}
    >
      {/* 视频 */}
      <video
        ref={videoRef}
        src={videoData.url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        webkit-playsinline="true"
        muted={isMuted}
      />

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      {/* 播放/暂停图标 */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/30 rounded-full p-6 backdrop-blur-sm">
              <FaPlay className="text-white text-4xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 字幕区域 */}
      <div className="absolute bottom-32 left-4 right-16 z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          {currentSubtitle.en && (
            <p className="text-white text-lg font-medium drop-shadow-lg">
              {currentSubtitle.en}
            </p>
          )}
          {currentSubtitle.cn && (
            <p className="text-white/90 text-base drop-shadow-lg">
              {currentSubtitle.cn}
            </p>
          )}
        </motion.div>

        {/* AI场景解析 */}
        {showAIAnalysis && videoData.ai_analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-black/60 backdrop-blur-md rounded-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/80 text-sm mb-1">🔍 AI场景解析</p>
            {videoData.ai_analysis.keywords.slice(0, 3).map((keyword, i) => (
              <p key={i} className="text-white/70 text-xs">
                {keyword.word}: {keyword.translation} ({keyword.usage_context})
              </p>
            ))}
          </motion.div>
        )}
      </div>

      {/* 右侧操作栏 */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleLike()
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/30'} backdrop-blur-sm`}>
            <FaHeart className={`text-2xl ${isLiked ? 'text-white' : 'text-white/80'}`} />
          </div>
          <span className="text-white text-xs">{likes}</span>
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm">
            <FaComment className="text-white/80 text-2xl" />
          </div>
          <span className="text-white text-xs">56</span>
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm">
            <FaShare className="text-white/80 text-2xl" />
          </div>
          <span className="text-white text-xs">分享</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowNoteEditor(true)
            if (videoRef.current) {
              videoRef.current.pause()
              setIsPlaying(false)
            }
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm">
            <FaStickyNote className="text-white/80 text-2xl" />
          </div>
          <span className="text-white text-xs">笔记</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowAIAnalysis(!showAIAnalysis)
          }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full ${showAIAnalysis ? 'bg-yellow-500' : 'bg-black/30'} backdrop-blur-sm`}>
            <FaStar className={`text-2xl ${showAIAnalysis ? 'text-white' : 'text-white/80'}`} />
          </div>
          <span className="text-white text-xs">AI解析</span>
        </button>
      </div>

      {/* 顶部进度条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 音量控制 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleMute()
        }}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm"
      >
        {isMuted ? (
          <FaVolumeMute className="text-white text-xl" />
        ) : (
          <FaVolumeUp className="text-white text-xl" />
        )}
      </button>

      {/* 闯关提示 */}
      {videoData.checkpoints?.map((checkpoint) => {
        // 提前15%就开始显示提示，让用户有充足时间准备
        const distanceToCheckpoint = checkpoint.time_percent - progress
        const isNear = distanceToCheckpoint > 0 && distanceToCheckpoint < 15
        return isNear ? (
          <motion.div
            key={checkpoint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-48 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 shadow-lg"
          >
            <p className="text-white text-base font-bold mb-1">🎯 AI闯关即将开始</p>
            <p className="text-white text-sm mb-1">
              距离闯关还有 {Math.ceil((distanceToCheckpoint * videoData.duration) / 100)} 秒
            </p>
            <p className="text-white/90 text-sm">
              题型：{checkpoint.type === 'vocabulary' ? '词汇题' : checkpoint.type === 'grammar' ? '语法题' : '场景题'}
              | 奖励：{checkpoint.points} 积分
            </p>
          </motion.div>
        ) : null
      })[0]}

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-0 right-0 text-center space-y-1">
        <p className="text-white/60 text-sm">⬆️ 上滑切换下一个视频</p>
        <p className="text-white/60 text-sm">点击字幕查看AI解析</p>
      </div>

      {/* 笔记编辑器弹窗 */}
      {showNoteEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <NoteEditor
            videoId={videoData.id}
            videoTitle={videoData.title}
            currentTime={currentTime}
            onClose={() => setShowNoteEditor(false)}
            onSave={() => {
              setShowNoteEditor(false)
              // 可以在这里添加提示用户笔记保存成功的逻辑
            }}
          />
        </div>
      )}
    </div>
  )
}