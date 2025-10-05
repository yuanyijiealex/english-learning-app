'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaMicrophone, FaStop, FaPlay, FaPause,
  FaRedo, FaChartLine, FaVolumeUp, FaTrophy,
  FaLightbulb, FaBook, FaHeadphones, FaMicrophoneSlash
} from 'react-icons/fa'

interface SpeakingExercise {
  id: string
  title: string
  category: 'pronunciation' | 'conversation' | 'reading' | 'shadowing'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  text: string
  audioUrl?: string
  tips: string[]
  targetScore: number
}

interface SpeakingResult {
  score: number
  pronunciation: number
  fluency: number
  accuracy: number
  intonation: number
  feedback: string[]
  recordingUrl: string
  timestamp: string
}

export default function SpeakingPage() {
  const router = useRouter()
  const [selectedExercise, setSelectedExercise] = useState<SpeakingExercise | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [result, setResult] = useState<SpeakingResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [history, setHistory] = useState<SpeakingResult[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const exercises: SpeakingExercise[] = [
    {
      id: '1',
      title: '自我介绍',
      category: 'conversation',
      difficulty: 'beginner',
      text: 'Hello, my name is [Your Name]. I\'m from [Your Country]. I\'m currently learning English to improve my communication skills. In my free time, I enjoy reading books and watching movies.',
      tips: [
        '语速适中，不要太快',
        '注意人名和地名的发音',
        '保持自然的语调'
      ],
      targetScore: 80
    },
    {
      id: '2',
      title: '咖啡店点单',
      category: 'conversation',
      difficulty: 'beginner',
      text: 'Good morning! I\'d like to order a large cappuccino with an extra shot, please. Could you make it with oat milk? And I\'ll also have a blueberry muffin. That\'s for here, thank you.',
      tips: [
        '注意礼貌用语的语调',
        'please 和 thank you 要清晰',
        '点单时语气要友好'
      ],
      targetScore: 85
    },
    {
      id: '3',
      title: '商务演讲开场',
      category: 'reading',
      difficulty: 'intermediate',
      text: 'Good afternoon, everyone. Thank you for joining today\'s presentation. I\'m excited to share our quarterly results and discuss our strategic plans for the upcoming year. Let\'s begin with an overview of our key achievements.',
      tips: [
        '开场要有力且自信',
        '注意停顿和节奏',
        '关键词要重读'
      ],
      targetScore: 90
    },
    {
      id: '4',
      title: '机场广播',
      category: 'shadowing',
      difficulty: 'intermediate',
      text: 'Attention passengers: Flight BA 283 to London Heathrow is now boarding at Gate 15. All passengers are requested to have their boarding passes and passports ready for inspection.',
      audioUrl: '/audio/airport.mp3',
      tips: [
        '模仿标准的广播语调',
        '数字和地名要清晰',
        '保持正式的语气'
      ],
      targetScore: 85
    },
    {
      id: '5',
      title: 'TED演讲片段',
      category: 'shadowing',
      difficulty: 'advanced',
      text: 'The power of vulnerability lies in our willingness to show up and be seen when we have no control over the outcome. It\'s about having the courage to be imperfect and to embrace our authentic selves.',
      audioUrl: '/audio/ted.mp3',
      tips: [
        '注意情感表达',
        '掌握演讲的节奏感',
        '关键概念要强调'
      ],
      targetScore: 95
    }
  ]

  useEffect(() => {
    // 加载历史记录
    const savedHistory = localStorage.getItem('speaking_history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // 开始计时
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('无法访问麦克风:', err)
      alert('请允许访问麦克风')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // 模拟AI评分
      setTimeout(() => {
        analyzeRecording()
      }, 1000)
    }
  }

  const analyzeRecording = () => {
    if (!selectedExercise || !audioUrl) return

    // 模拟AI分析结果
    const pronunciation = 70 + Math.random() * 25
    const fluency = 65 + Math.random() * 30
    const accuracy = 75 + Math.random() * 20
    const intonation = 60 + Math.random() * 35

    const overallScore = (pronunciation + fluency + accuracy + intonation) / 4

    const feedback = []
    if (pronunciation < 80) feedback.push('发音需要更清晰，特别注意元音的准确度')
    if (fluency < 80) feedback.push('语速可以更流畅，减少停顿')
    if (accuracy < 80) feedback.push('部分单词发音不够准确，建议多练习')
    if (intonation < 80) feedback.push('语调可以更自然，注意句子的升降调')
    if (overallScore >= 90) feedback.push('表现优秀！继续保持')

    const result: SpeakingResult = {
      score: Math.round(overallScore),
      pronunciation: Math.round(pronunciation),
      fluency: Math.round(fluency),
      accuracy: Math.round(accuracy),
      intonation: Math.round(intonation),
      feedback,
      recordingUrl: audioUrl,
      timestamp: new Date().toISOString()
    }

    setResult(result)
    setShowResult(true)

    // 保存到历史记录
    const newHistory = [result, ...history].slice(0, 20) // 只保留最近20条
    setHistory(newHistory)
    localStorage.setItem('speaking_history', JSON.stringify(newHistory))
  }

  const playRecording = () => {
    if (audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play()
          setIsPlaying(true)
        }
      } else {
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        audio.onended = () => setIsPlaying(false)
        audio.play()
        setIsPlaying(true)
      }
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setResult(null)
    setShowResult(false)
    setRecordingTime(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆'
    if (score >= 80) return '⭐'
    if (score >= 70) return '👍'
    return '💪'
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
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FaMicrophone /> AI口语评测
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧练习列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold mb-4">选择练习</h2>
              <div className="space-y-2">
                {exercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      setSelectedExercise(exercise)
                      resetRecording()
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedExercise?.id === exercise.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{exercise.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {exercise.difficulty === 'beginner' ? '初级' :
                         exercise.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {exercise.category === 'pronunciation' && <span>🗣️ 发音</span>}
                      {exercise.category === 'conversation' && <span>💬 对话</span>}
                      {exercise.category === 'reading' && <span>📖 朗读</span>}
                      {exercise.category === 'shadowing' && <span>🎧 跟读</span>}
                      <span>• 目标 {exercise.targetScore} 分</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 历史记录 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FaChartLine className="text-purple-600" />
                最近练习
              </h3>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.slice(0, 5).map((record, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-bold ${getScoreColor(record.score)}`}>
                            {record.score} 分 {getScoreEmoji(record.score)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.timestamp).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAudioUrl(record.recordingUrl)
                            setResult(record)
                            setShowResult(true)
                          }}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          查看
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">暂无练习记录</p>
              )}
            </div>
          </div>

          {/* 右侧练习区域 */}
          <div className="lg:col-span-2">
            {selectedExercise ? (
              <>
                {/* 练习内容 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                  <h2 className="text-lg font-bold mb-4">{selectedExercise.title}</h2>

                  {/* 原音播放（如果有） */}
                  {selectedExercise.audioUrl && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <FaHeadphones />
                          先听原音示范
                        </span>
                        <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">
                          播放原音
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 练习文本 */}
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-lg leading-relaxed">{selectedExercise.text}</p>
                  </div>

                  {/* 提示 */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FaLightbulb className="text-yellow-500" />
                      练习提示
                    </h4>
                    <ul className="space-y-1">
                      {selectedExercise.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 录音控制 */}
                  <div className="flex flex-col items-center">
                    {!audioUrl ? (
                      // 录音按钮
                      <div className="text-center">
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                            isRecording
                              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                              : 'bg-purple-600 hover:bg-purple-700'
                          } text-white shadow-lg`}
                        >
                          {isRecording ? <FaStop size={32} /> : <FaMicrophone size={32} />}
                        </button>
                        {isRecording && (
                          <div className="mt-4">
                            <p className="text-red-500 font-medium">正在录音...</p>
                            <p className="text-2xl font-bold">{formatTime(recordingTime)}</p>
                          </div>
                        )}
                        {!isRecording && (
                          <p className="text-gray-600 mt-4">点击开始录音</p>
                        )}
                      </div>
                    ) : (
                      // 录音回放和控制
                      <div className="w-full">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <button
                            onClick={playRecording}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                          >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                            {isPlaying ? '暂停' : '播放录音'}
                          </button>
                          <button
                            onClick={resetRecording}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                          >
                            <FaRedo />
                            重新录制
                          </button>
                        </div>

                        <audio ref={audioRef} src={audioUrl} />
                      </div>
                    )}
                  </div>
                </div>

                {/* 评测结果 */}
                {showResult && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FaTrophy className="text-yellow-500" />
                      评测结果
                    </h3>

                    {/* 总分 */}
                    <div className="text-center mb-6">
                      <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}
                      </div>
                      <p className="text-gray-600">综合得分</p>
                      <div className="text-3xl mt-2">{getScoreEmoji(result.score)}</div>
                    </div>

                    {/* 各项得分 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{result.pronunciation}</p>
                        <p className="text-sm text-gray-600">发音</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{result.fluency}</p>
                        <p className="text-sm text-gray-600">流利度</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{result.accuracy}</p>
                        <p className="text-sm text-gray-600">准确度</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{result.intonation}</p>
                        <p className="text-sm text-gray-600">语调</p>
                      </div>
                    </div>

                    {/* 反馈建议 */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <FaLightbulb className="text-yellow-500" />
                        改进建议
                      </h4>
                      <ul className="space-y-1">
                        {result.feedback.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FaMicrophone className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">请选择一个练习开始</p>
                <p className="text-sm text-gray-400">
                  通过AI评测，提升你的英语口语能力
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}