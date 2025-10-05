'use client'

import { useState } from 'react'
import GameCard, { CardHeader, CardTitle, CardContent, CardBadge } from '@/components/ui/GameCard'
import GameButton, { FloatingActionButton, IconButton } from '@/components/ui/GameButton'
import { AchievementBadge, AchievementProgress, LevelBadge } from '@/components/ui/Achievement'
import { ComboDisplay, LevelUpDisplay, AchievementPopup, ScorePopup } from '@/components/ui/AnimatedFeedback'
import { useGameAnimation, useScoreAnimation, useComboAnimation } from '@/hooks/useGameAnimation'
import { FaStar, FaTrophy, FaFire, FaHeart, FaGem, FaRocket, FaBolt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function UITestPage() {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const { displayScore, addScore } = useScoreAnimation(1000)
  const { combo, isComboActive, incrementCombo, resetCombo } = useComboAnimation()
  const [showScorePopup, setShowScorePopup] = useState(false)

  const achievements = [
    { id: '1', title: '初学者', description: '完成第一个视频', icon: '🎯', unlocked: true, rarity: 'common' as const, points: 100 },
    { id: '2', title: '连击达人', description: '达成10连击', icon: '⚡', unlocked: true, rarity: 'rare' as const, points: 200 },
    { id: '3', title: '学霸', description: '连续学习30天', icon: '📚', unlocked: false, progress: 15, maxProgress: 30, rarity: 'epic' as const, points: 500 },
    { id: '4', title: '传奇学者', description: '解锁所有成就', icon: '👑', unlocked: false, rarity: 'legendary' as const, points: 1000 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center game-gradient-text mb-8"
        >
          游戏化UI组件测试
        </motion.h1>

        {/* 游戏卡片展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">游戏卡片</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GameCard variant="default" animate="fade-in">
              <CardHeader icon={<FaStar className="text-2xl" />}>
                <CardTitle>默认卡片</CardTitle>
              </CardHeader>
              <CardContent>
                这是一个默认样式的游戏卡片，带有柔和的阴影和圆角设计。
              </CardContent>
            </GameCard>

            <GameCard variant="glass" animate="slide-up">
              <CardHeader icon={<FaGem className="text-2xl text-accent-purple" />}>
                <CardTitle>玻璃态卡片</CardTitle>
              </CardHeader>
              <CardContent>
                采用玻璃态设计，背景模糊效果，半透明质感。
              </CardContent>
            </GameCard>

            <GameCard variant="gradient" animate="scale-up">
              <CardHeader>
                <CardTitle className="text-white">渐变卡片</CardTitle>
              </CardHeader>
              <CardContent className="text-white/90">
                使用活力糖果色系渐变背景，视觉冲击力强。
              </CardContent>
            </GameCard>
          </div>
        </section>

        {/* 游戏按钮展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">游戏按钮</h2>
          <div className="flex flex-wrap gap-4">
            <GameButton variant="primary" icon={<FaStar />}>主要按钮</GameButton>
            <GameButton variant="secondary" icon={<FaHeart />}>次要按钮</GameButton>
            <GameButton variant="gradient" icon={<FaRocket />}>渐变按钮</GameButton>
            <GameButton variant="glass">玻璃按钮</GameButton>
            <GameButton variant="neon" icon={<FaBolt />}>霓虹按钮</GameButton>
            <GameButton variant="success" loading>加载中...</GameButton>
          </div>

          <div className="flex gap-4 mt-4">
            <IconButton variant="primary"><FaTrophy /></IconButton>
            <IconButton variant="default"><FaFire /></IconButton>
            <IconButton variant="ghost"><FaStar /></IconButton>
          </div>
        </section>

        {/* 成就系统展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">成就系统</h2>

          {/* 成就徽章 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="md"
                showDetails
              />
            ))}
          </div>

          {/* 成就进度 */}
          <div className="space-y-3 mt-6">
            <AchievementProgress
              title="每日任务"
              current={3}
              total={5}
              icon="📅"
              color="primary"
            />
            <AchievementProgress
              title="视频完成"
              current={25}
              total={30}
              icon="🎬"
              color="secondary"
            />
            <AchievementProgress
              title="词汇掌握"
              current={150}
              total={200}
              icon="📝"
              color="success"
            />
          </div>
        </section>

        {/* 等级系统展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">等级系统</h2>
          <div className="flex items-center gap-8">
            <LevelBadge level={5} xp={450} xpRequired={1000} size="sm" showProgress />
            <LevelBadge level={10} xp={2800} xpRequired={5000} size="md" showProgress />
            <LevelBadge level={20} xp={8500} xpRequired={10000} size="lg" showProgress />
          </div>
        </section>

        {/* 动画效果演示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">动画效果</h2>
          <div className="flex flex-wrap gap-4">
            <GameButton
              variant="gradient"
              onClick={() => {
                incrementCombo()
                addScore(100)
              }}
            >
              增加连击 (+100分)
            </GameButton>

            <GameButton
              variant="primary"
              onClick={() => setShowLevelUp(true)}
            >
              等级提升动画
            </GameButton>

            <GameButton
              variant="secondary"
              onClick={() => setShowAchievement(true)}
            >
              成就解锁通知
            </GameButton>

            <GameButton
              variant="success"
              onClick={() => resetCombo()}
            >
              重置连击
            </GameButton>
          </div>

          {/* 分数显示 */}
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-game-card">
            <div className="flex items-center gap-3">
              <FaStar className="text-game-gold text-2xl" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayScore.toLocaleString()} 积分
              </span>
            </div>
          </div>
        </section>

        {/* 样式效果展示 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">特殊效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 glass-effect rounded-2xl text-center">
              <h3 className="text-lg font-semibold mb-2">玻璃效果</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">backdrop-filter 模糊背景</p>
            </div>

            <div className="p-6 neumorphism rounded-2xl text-center">
              <h3 className="text-lg font-semibold mb-2">新拟态效果</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">柔和的凸起和凹陷</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl text-center rainbow-border">
              <h3 className="text-lg font-semibold mb-2">彩虹边框</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">动态渐变边框动画</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-gradient-candy rounded-2xl text-white text-center shine-effect">
              <h3 className="text-lg font-semibold mb-2">闪光效果</h3>
              <p className="text-sm">扫光动画增强视觉吸引力</p>
            </div>

            <div className="p-6 bg-primary rounded-2xl text-white text-center pulse-ring">
              <h3 className="text-lg font-semibold mb-2">脉冲光环</h3>
              <p className="text-sm">向外扩散的光环效果</p>
            </div>
          </div>
        </section>

        {/* 输入框样式 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">游戏化输入框</h2>
          <div className="space-y-3 max-w-md">
            <input
              type="text"
              placeholder="游戏化输入框"
              className="w-full game-input"
            />
            <input
              type="email"
              placeholder="邮箱地址"
              className="w-full game-input"
            />
            <textarea
              placeholder="多行文本输入"
              rows={4}
              className="w-full game-input resize-none"
            />
          </div>
        </section>
      </div>

      {/* 动画弹窗 */}
      <ComboDisplay combo={combo} isActive={isComboActive} />
      <LevelUpDisplay show={showLevelUp} level={11} />
      <AchievementPopup
        title="学习达人"
        description="连续学习7天"
        icon="🔥"
        show={showAchievement}
        onClose={() => setShowAchievement(false)}
      />

      {/* 浮动按钮 */}
      <FloatingActionButton
        variant="gradient"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </FloatingActionButton>
    </div>
  )
}