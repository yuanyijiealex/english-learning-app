'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaCloudUploadAlt, FaVideo, FaTimes, FaCheck } from 'react-icons/fa'

interface VideoUploaderProps {
  onUploadComplete: (video: any) => void
}

export default function VideoUploader({ onUploadComplete }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))

    if (videoFile) {
      handleFileSelect(videoFile)
    } else {
      alert('请选择视频文件')
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      alert('视频文件不能超过100MB')
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // 模拟上传完成
    setTimeout(() => {
      const video = {
        id: Date.now().toString(),
        title: selectedFile.name.replace(/\.[^/.]+$/, ''),
        url: URL.createObjectURL(selectedFile),
        thumbnail: '/api/placeholder/400/300',
        duration: Math.floor(Math.random() * 180) + 30,
        category: 'daily',
        difficulty: 'intermediate',
        uploadedAt: new Date().toISOString()
      }

      onUploadComplete(video)
      setIsUploading(false)
      setUploadProgress(0)
      setSelectedFile(null)
    }, 2000)
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <FaCloudUploadAlt className="text-5xl mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">拖拽视频文件到这里上传</p>
          <p className="text-sm text-gray-500 mb-4">或点击选择文件</p>
          <p className="text-xs text-gray-400">支持 MP4, MOV, AVI 格式，最大 100MB</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
          />
        </div>
      ) : (
        <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaVideo className="text-purple-600 text-2xl" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>上传中...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={handleUpload}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaCloudUploadAlt /> 开始上传
            </button>
          )}

          {uploadProgress === 100 && (
            <div className="text-center text-green-600 flex items-center justify-center gap-2 mt-4">
              <FaCheck /> 上传成功！
            </div>
          )}
        </div>
      )}
    </div>
  )
}