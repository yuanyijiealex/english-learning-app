import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai-service'

export async function POST(request: NextRequest) {
  try {
    const { transcript_en, transcript_cn, title } = await request.json()

    if (!transcript_en || !transcript_cn) {
      return NextResponse.json(
        { error: 'Transcripts are required' },
        { status: 400 }
      )
    }

    // 使用统一的AI服务
    const result = await aiService.analyzeVideoContent(
      transcript_en,
      transcript_cn,
      title
    )

    // 估算成本（用于监控）
    const tokensUsed = JSON.stringify(transcript_en).length + JSON.stringify(transcript_cn).length
    const cost = aiService.estimateCost(tokensUsed)

    console.log(`Analysis completed using ${cost.provider}, estimated cost: ${cost.currency}${cost.cost.toFixed(4)}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Video analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    )
  }
}