'use client'

import React from 'react'

// 成就类型定义
export interface AchievementData {
  id: string
  title: string
  description: string
  icon: string
  progress?: number
  maxProgress?: number
  unlocked: boolean
  unlockedAt?: Date
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  points?: number
}

// 成就徽章组件
interface AchievementBadgeProps {
  achievement: AchievementData
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  onClick?: () => void
  animate?: boolean
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showDetails = false,
  onClick,
  animate = true
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  }

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600'
  }

  const rarityGlow = {
    common: '',
    rare: 'shadow-lg shadow-blue-500/30',
    epic: 'shadow-lg shadow-purple-500/30',
    legendary: 'shadow-xl shadow-yellow-500/40 animate-pulse-slow'
  }

  return (
    <div
      className={`
        ${showDetails ? 'flex items-center gap-3' : 'inline-block'}
        ${onClick ? 'cursor-pointer' : ''}
        ${animate ? 'hover:scale-105 transition-transform duration-200' : ''}
      `}
      onClick={onClick}
    >
      <div className="relative">
        {/* 徽章主体 */}
        <div
          className={`
            ${sizeClasses[size]}
            ${achievement.unlocked ? `bg-gradient-to-br ${rarityColors[achievement.rarity || 'common']}` : 'bg-gray-300 dark:bg-gray-600'}
            ${achievement.unlocked && achievement.rarity ? rarityGlow[achievement.rarity] : ''}
            rounded-full
            flex items-center justify-center
            text-white
            relative
            ${achievement.unlocked && animate ? 'animate-fade-in' : ''}
          `}
        >
          <span className={achievement.unlocked ? '' : 'opacity-50'}>
            {achievement.icon}
          </span>

          {/* 锁定状态遮罩 */}
          {!achievement.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 rounded-full">
              <span className="text-gray-300 text-lg">🔒</span>
            </div>
          )}
        </div>

        {/* 进度环 */}
        {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${(achievement.progress / achievement.maxProgress) * 100 * 3.14} 314`}
              className="text-primary transition-all duration-500"
            />
          </svg>
        )}

        {/* 稀有度星星 */}
        {achievement.unlocked && achievement.rarity === 'legendary' && (
          <div className="absolute -top-1 -right-1">
            <span className="text-yellow-400 text-sm animate-sparkle">⭐</span>
          </div>
        )}
      </div>

      {/* 详情文本 */}
      {showDetails && (
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 dark:text-white ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
            {achievement.title}
          </h3>
          <p className={`text-gray-600 dark:text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {achievement.description}
          </p>
          {achievement.progress !== undefined && achievement.maxProgress && (
            <p className={`text-primary ${size === 'sm' ? 'text-xs' : 'text-sm'} mt-1`}>
              进度: {achievement.progress}/{achievement.maxProgress}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// 成就展示墙组件
interface AchievementWallProps {
  achievements: AchievementData[]
  columns?: number
  onAchievementClick?: (achievement: AchievementData) => void
}

export const AchievementWall: React.FC<AchievementWallProps> = ({
  achievements,
  columns = 4,
  onAchievementClick
}) => {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="lg"
          onClick={() => onAchievementClick?.(achievement)}
        />
      ))}
    </div>
  )
}

// 成就通知组件
interface AchievementNotificationProps {
  achievement: AchievementData
  onClose?: () => void
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  React.useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-down">
      <div className="bg-gradient-candy text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
        <div className="text-4xl animate-bounce-slow">🏆</div>
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90">成就解锁！</p>
          <h3 className="text-lg font-bold">{achievement.title}</h3>
          <p className="text-sm opacity-90">{achievement.description}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

// 成就进度条组件
interface AchievementProgressProps {
  title: string
  current: number
  total: number
  icon?: string
  showPercentage?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning'
}

export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  title,
  current,
  total,
  icon,
  showPercentage = true,
  color = 'primary'
}) => {
  const percentage = Math.min((current / total) * 100, 100)

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning'
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-game-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {current}/{total} {showPercentage && `(${Math.floor(percentage)}%)`}
        </span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// 等级徽章组件
interface LevelBadgeProps {
  level: number
  xp: number
  xpRequired: number
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  xp,
  xpRequired,
  size = 'md',
  showProgress = false
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-28 h-28 text-3xl'
  }

  const percentage = (xp / xpRequired) * 100

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses[size]}
          bg-gradient-to-br from-game-gold to-game-xp
          rounded-full
          flex items-center justify-center
          text-white
          font-bold
          shadow-xl shadow-game-gold/30
          relative
          animate-float
        `}
      >
        <span className="relative z-10">Lv.{level}</span>

        {/* 光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
      </div>

      {/* XP进度环 */}
      {showProgress && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${percentage * 3.14} 314`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#FFC800" />
              <stop offset="100%" stopColor="#FF6B9D" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* XP文本 */}
      {showProgress && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {xp}/{xpRequired} XP
        </div>
      )}
    </div>
  )
}

export default AchievementBadge