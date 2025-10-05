import { Video } from '@/types/video'

export const mockVideos: Video[] = [
  {
    id: '1',
    title: '咖啡店对话',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4', // 使用公开的示例视频
    duration: 180,
    difficulty: 2,
    category: '日常生活',
    accent: 'US',
    thumbnail: 'https://via.placeholder.com/400x600/667eea/ffffff?text=Coffee+Shop',
    transcript_en: [
      { start: 0, end: 3, text: "How's the weather today?" },
      { start: 3, end: 6, text: "It's pretty nice outside!" },
      { start: 6, end: 9, text: "Would you like to grab a coffee?" },
      { start: 9, end: 12, text: "That sounds great! Let's go." }
    ],
    transcript_cn: [
      { start: 0, end: 3, text: "今天天气怎么样？" },
      { start: 3, end: 6, text: "外面天气很好！" },
      { start: 6, end: 9, text: "要不要去喝杯咖啡？" },
      { start: 9, end: 12, text: "听起来不错！走吧。" }
    ],
    checkpoints: [
      {
        id: 'cp1',
        time_percent: 30,
        type: 'scene',
        question: '视频中"grab a coffee"的使用场景是？',
        options: ['正式会议邀请', '休闲社交约会', '紧急工作安排'],
        correct_answer: 1,
        explanation: '在美国文化中，grab a coffee通常用于轻松的社交邀约',
        ai_hint: '注意说话者的语气',
        points: 20
      },
      {
        id: 'cp2',
        time_percent: 60,
        type: 'vocabulary',
        question: '"weather"这个词的正确发音重音在？',
        options: ['第一个音节', '第二个音节', '两个音节均等'],
        correct_answer: 0,
        explanation: 'Weather的重音在第一个音节：WEA-ther',
        points: 20
      },
      {
        id: 'cp3',
        time_percent: 90,
        type: 'grammar',
        question: '"How\'s"是哪两个词的缩写？',
        options: ['How was', 'How is', 'How has'],
        correct_answer: 1,
        explanation: "How's = How is，用于询问当前状态",
        points: 20
      }
    ],
    ai_analysis: {
      keywords: [
        {
          word: 'weather',
          translation: '天气',
          frequency: 2,
          usage_context: '日常问候',
          difficulty: 'easy'
        },
        {
          word: 'grab',
          translation: '抓取/快速获得',
          frequency: 1,
          usage_context: '非正式用语',
          difficulty: 'medium'
        },
        {
          word: 'sounds',
          translation: '听起来',
          frequency: 1,
          usage_context: '表达观点',
          difficulty: 'easy'
        }
      ],
      phrases: [
        {
          phrase: 'grab a coffee',
          translation: '喝杯咖啡',
          usage_example: "Let's grab a coffee after work",
          formal_level: 'casual'
        },
        {
          phrase: 'sounds great',
          translation: '听起来不错',
          usage_example: 'Your plan sounds great to me',
          formal_level: 'neutral'
        }
      ],
      scenarios: ['日常问候', '社交邀约', '表达同意'],
      difficulty_score: 2.5,
      summary: '这是一段关于日常社交的对话，展示了美式英语中常见的问候和邀约方式'
    },
    view_count: 1523,
    created_at: '2024-09-30'
  },
  {
    id: '2',
    title: '机场值机',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 240,
    difficulty: 3,
    category: '旅行',
    accent: 'UK',
    thumbnail: 'https://via.placeholder.com/400x600/764ba2/ffffff?text=Airport',
    transcript_en: [
      { start: 0, end: 3, text: "Good morning! Where are you flying to today?" },
      { start: 3, end: 6, text: "I'm heading to London for a business trip." },
      { start: 6, end: 9, text: "May I see your passport and ticket, please?" },
      { start: 9, end: 12, text: "Here you go. Is the flight on time?" }
    ],
    transcript_cn: [
      { start: 0, end: 3, text: "早上好！您今天要飞往哪里？" },
      { start: 3, end: 6, text: "我要去伦敦出差。" },
      { start: 6, end: 9, text: "请出示您的护照和机票。" },
      { start: 9, end: 12, text: "给您。航班准点吗？" }
    ],
    checkpoints: [
      {
        id: 'cp1',
        time_percent: 30,
        type: 'vocabulary',
        question: '"heading to"在这里的意思是？',
        options: ['返回', '前往', '起飞'],
        correct_answer: 1,
        explanation: 'heading to表示正在前往某地',
        ai_hint: '想想head作为动词的含义',
        points: 20
      }
    ],
    ai_analysis: {
      keywords: [
        {
          word: 'passport',
          translation: '护照',
          frequency: 1,
          usage_context: '机场用语',
          difficulty: 'easy'
        },
        {
          word: 'flight',
          translation: '航班',
          frequency: 1,
          usage_context: '旅行词汇',
          difficulty: 'easy'
        }
      ],
      phrases: [
        {
          phrase: 'heading to',
          translation: '前往',
          usage_example: "I'm heading to the office",
          formal_level: 'neutral'
        },
        {
          phrase: 'on time',
          translation: '准点',
          usage_example: 'The train is always on time',
          formal_level: 'neutral'
        }
      ],
      scenarios: ['机场办理登机', '商务旅行', '询问信息'],
      difficulty_score: 3,
      summary: '机场办理登机手续的标准对话，包含常见的旅行词汇'
    },
    view_count: 2341,
    created_at: '2024-09-29'
  },
  {
    id: '3',
    title: '求职面试技巧',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 300,
    difficulty: 4,
    category: '职场',
    accent: 'US',
    thumbnail: 'https://via.placeholder.com/400x600/f093fb/ffffff?text=Job+Interview',
    transcript_en: [
      { start: 0, end: 4, text: "Tell me about your previous work experience." },
      { start: 4, end: 8, text: "I worked as a software developer for three years." },
      { start: 8, end: 12, text: "What are your greatest strengths?" },
      { start: 12, end: 16, text: "I'm detail-oriented and a good team player." }
    ],
    transcript_cn: [
      { start: 0, end: 4, text: "请介绍一下您之前的工作经历。" },
      { start: 4, end: 8, text: "我做了三年的软件开发工程师。" },
      { start: 8, end: 12, text: "您最大的优点是什么？" },
      { start: 12, end: 16, text: "我注重细节，而且是个好的团队合作者。" }
    ],
    checkpoints: [
      {
        id: 'cp1',
        time_percent: 30,
        type: 'vocabulary',
        question: '"detail-oriented"的意思是？',
        options: ['粗心大意', '注重细节', '面向对象'],
        correct_answer: 1,
        explanation: 'detail-oriented表示注重细节的性格特点',
        points: 25
      },
      {
        id: 'cp2',
        time_percent: 60,
        type: 'scene',
        question: '面试官问"greatest strengths"时，应该？',
        options: ['谦虚说没有优点', '列举与工作相关的优点', '夸大自己的能力'],
        correct_answer: 1,
        explanation: '回答应该真实且与应聘职位相关',
        points: 25
      }
    ],
    ai_analysis: {
      keywords: [
        {
          word: 'experience',
          translation: '经历/经验',
          frequency: 1,
          usage_context: '面试必问',
          difficulty: 'medium'
        },
        {
          word: 'strengths',
          translation: '优点/长处',
          frequency: 1,
          usage_context: '自我评价',
          difficulty: 'medium'
        },
        {
          word: 'detail-oriented',
          translation: '注重细节的',
          frequency: 1,
          usage_context: '性格描述',
          difficulty: 'hard'
        }
      ],
      phrases: [
        {
          phrase: 'team player',
          translation: '团队合作者',
          usage_example: "We're looking for a team player",
          formal_level: 'formal'
        },
        {
          phrase: 'worked as',
          translation: '担任/从事',
          usage_example: 'I worked as a consultant',
          formal_level: 'formal'
        }
      ],
      scenarios: ['求职面试', '自我介绍', '职业规划'],
      difficulty_score: 4,
      summary: '典型的求职面试对话，包含自我介绍和优势描述'
    },
    view_count: 3892,
    created_at: '2024-09-28'
  }
]