import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // 将 File 转换为 Whisper API 需要的格式
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type })

    // 使用 Whisper 进行英文转录
    const transcriptionEn = await openai.audio.transcriptions.create({
      file: new File([audioBlob], audioFile.name, { type: audioFile.type }),
      model: 'whisper-1',
      language: 'en',
      response_format: 'verbose_json',
      timestamp_granularities: ['word']
    })

    // 使用 Whisper 进行中文翻译
    const translationCn = await openai.audio.translations.create({
      file: new File([audioBlob], audioFile.name, { type: audioFile.type }),
      model: 'whisper-1',
      response_format: 'verbose_json'
    })

    // 格式化字幕数据
    const formatSubtitles = (segments: any[]) => {
      return segments.map(segment => ({
        start: segment.start,
        end: segment.end,
        text: segment.text.trim()
      }))
    }

    const result = {
      transcript_en: formatSubtitles((transcriptionEn as any).segments || []),
      transcript_cn: formatSubtitles((translationCn as any).segments || []),
      duration: Math.round((transcriptionEn as any).duration || 0)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}

// 配置文件大小限制 (50MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
}