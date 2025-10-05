'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkpoint } from '@/types/video'

interface QuizModalProps {
  checkpoint: Checkpoint
  isOpen: boolean
  onClose: () => void
  onAnswer: (correct: boolean, points: number) => void
}

export default function QuizModal({
  checkpoint,
  isOpen,
  onClose,
  onAnswer
}: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(45) // 增加到45秒，给用户更多思考时间
  const [isCorrect, setIsCorrect] = useState(false)

  // 倒计时
  useEffect(() => {
    if (!isOpen || showResult) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, showResult])

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(45) // 重置为45秒
      setIsCorrect(false)
    }
  }, [isOpen])

  const handleTimeout = () => {
    setShowResult(true)
    setIsCorrect(false)
    onAnswer(false, 0)
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === checkpoint.correct_answer
    setIsCorrect(correct)
    setShowResult(true)

    onAnswer(correct, correct ? checkpoint.points : -5)

    // 3秒后自动关闭
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!showResult ? (
              <>
                {/* 标题 */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    🎯 AI场景理解关卡
                  </h2>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      答对可获得 {checkpoint.points} 积分
                    </span>
                    <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      剩余: {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / 45) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>

                {/* 问题 */}
                <div className="mb-6">
                  <p className="text-lg font-medium mb-1 text-gray-900 dark:text-gray-100">{checkpoint.question}</p>
                  {checkpoint.ai_hint && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      💡 {checkpoint.ai_hint}
                    </p>
                  )}
                </div>

                {/* 选项 */}
                <div className="space-y-3 mb-6">
                  {checkpoint.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="flex-1 text-gray-900 dark:text-gray-100">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 提交按钮 */}
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    selectedAnswer !== null
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  确认答案
                </button>
              </>
            ) : (
              /* 结果展示 */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  {isCorrect ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mb-4"
                      >
                        <span className="text-6xl">✅</span>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        回答正确！
                      </h3>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        +{checkpoint.points} 积分
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-4"
                      >
                        <span className="text-6xl">❌</span>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {timeLeft === 0 ? '时间到了！' : '回答错误'}
                      </h3>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        -5 积分
                      </p>
                    </>
                  )}
                </div>

                {/* AI解析 */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    📚 AI知识点解析
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    正确答案: {checkpoint.options[checkpoint.correct_answer]}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {checkpoint.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}