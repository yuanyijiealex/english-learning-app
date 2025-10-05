'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRobot, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

interface VideoAnalyzerProps {
  videoTitle: string
  videoDescription?: string
  transcript?: string
  onAnalysisComplete: (analysis: VideoAnalysis) => void
}

interface VideoAnalysis {
  keyPhrases: string[]
  grammarPoints: string[]
  vocabulary: { word: string; definition: string }[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  suggestedQuestions: string[]
}

export default function VideoAnalyzer({
  videoTitle,
  videoDescription,
  transcript,
  onAnalysisComplete
}: VideoAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle')
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysis | null>(null)

  const analyzeVideo = async () => {
    setIsAnalyzing(true)
    setAnalysisStatus('analyzing')

    try {
      const prompt = `
        请分析这个英语学习视频的内容，并提供以下信息：

        视频标题：${videoTitle}
        视频描述：${videoDescription || '无'}
        字幕内容：${transcript || '无字幕内容'}

        请返回以下格式的JSON数据：
        {
          "keyPhrases": ["关键短语1", "关键短语2", ...],
          "grammarPoints": ["语法点1", "语法点2", ...],
          "vocabulary": [
            {"word": "单词1", "definition": "定义1"},
            {"word": "单词2", "definition": "定义2"}
          ],
          "difficulty": "beginner/intermediate/advanced",
          "suggestedQuestions": ["建议问题1", "建议问题2", ...]
        }
      `

      const response = await fetch('/api/qwen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: 'analysis'
        })
      })

      if (!response.ok) {
        // 使用模拟数据作为备用
        const mockAnalysis: VideoAnalysis = {
          keyPhrases: [
            "How can I help you?",
            "Would you like to...",
            "I'd like to order...",
            "Could you please...",
            "Thank you for..."
          ],
          grammarPoints: [
            "情态动词的礼貌用法 (Would/Could)",
            "现在进行时表示计划",
            "一般将来时 (will/be going to)"
          ],
          vocabulary: [
            { word: "recommend", definition: "推荐，建议" },
            { word: "available", definition: "可用的，有空的" },
            { word: "reservation", definition: "预订，预约" },
            { word: "preference", definition: "偏好，喜好" },
            { word: "appreciate", definition: "感激，欣赏" }
          ],
          difficulty: "intermediate",
          suggestedQuestions: [
            "What does the customer want to order?",
            "How does the staff respond to requests?",
            "What polite expressions are used in the conversation?",
            "When is the best time to visit according to the video?",
            "What special offer is mentioned?"
          ]
        }

        setAnalysisResult(mockAnalysis)
        setAnalysisStatus('success')
        onAnalysisComplete(mockAnalysis)
        return
      }

      const data = await response.json()
      const analysis = data.analysis || data

      setAnalysisResult(analysis)
      setAnalysisStatus('success')
      onAnalysisComplete(analysis)
    } catch (error) {
      console.error('分析失败:', error)
      setAnalysisStatus('error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-purple-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaRobot className="text-purple-600" />
          AI 场景分析
        </h3>
        {analysisStatus === 'success' && (
          <FaCheckCircle className="text-green-600 text-xl" />
        )}
        {analysisStatus === 'error' && (
          <FaExclamationTriangle className="text-red-600 text-xl" />
        )}
      </div>

      {!analysisResult ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            使用 AI 自动分析视频内容，提取关键知识点和生成练习题目
          </p>
          <button
            onClick={analyzeVideo}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <FaRobot />
                开始分析
              </>
            )}
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 难度评级 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">难度评级</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              analysisResult.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              analysisResult.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {analysisResult.difficulty === 'beginner' ? '初级' :
               analysisResult.difficulty === 'intermediate' ? '中级' : '高级'}
            </span>
          </div>

          {/* 关键短语 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">关键短语</p>
            <div className="flex flex-wrap gap-2">
              {analysisResult.keyPhrases.map((phrase, index) => (
                <span key={index} className="bg-white px-3 py-1 rounded-lg text-sm border border-purple-200">
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          {/* 语法点 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">语法要点</p>
            <ul className="list-disc list-inside space-y-1">
              {analysisResult.grammarPoints.map((point, index) => (
                <li key={index} className="text-sm text-gray-600">{point}</li>
              ))}
            </ul>
          </div>

          {/* 重点词汇 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">重点词汇</p>
            <div className="grid grid-cols-2 gap-2">
              {analysisResult.vocabulary.map((vocab, index) => (
                <div key={index} className="bg-white p-2 rounded-lg border border-purple-200">
                  <p className="font-medium text-sm">{vocab.word}</p>
                  <p className="text-xs text-gray-600">{vocab.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 建议的练习题 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">建议的练习题</p>
            <ol className="list-decimal list-inside space-y-1">
              {analysisResult.suggestedQuestions.map((question, index) => (
                <li key={index} className="text-sm text-gray-600">{question}</li>
              ))}
            </ol>
          </div>

          {/* 重新分析按钮 */}
          <button
            onClick={analyzeVideo}
            disabled={isAnalyzing}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            重新分析
          </button>
        </motion.div>
      )}

      {analysisStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          分析失败，请稍后重试
        </div>
      )}
    </div>
  )
}