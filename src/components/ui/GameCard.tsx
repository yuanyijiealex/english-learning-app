'use client'

import React, { ReactNode, CSSProperties } from 'react'

interface GameCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'neon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  onClick?: () => void
  style?: CSSProperties
  animate?: 'none' | 'fade-in' | 'slide-up' | 'scale-up'
  glow?: boolean
}

const GameCard: React.FC<GameCardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = true,
  onClick,
  style,
  animate = 'none',
  glow = false
}) => {
  const sizeClasses = {
    sm: 'p-3 rounded-xl',
    md: 'p-4 rounded-2xl',
    lg: 'p-6 rounded-3xl',
    xl: 'p-8 rounded-3xl'
  }

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-game-card',
    elevated: 'bg-white dark:bg-gray-800 shadow-xl shadow-primary/10',
    glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-glass',
    gradient: 'bg-gradient-candy text-white shadow-xl',
    neon: 'bg-primary/10 dark:bg-primary/20 border-2 border-primary shadow-neon'
  }

  const hoverClasses = hover
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
    : ''

  const animateClasses = {
    none: '',
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'scale-up': 'animate-scale-up'
  }

  const glowClass = glow ? 'animate-glow' : ''

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${hoverClasses}
        ${animateClasses[animate]}
        ${glowClass}
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}

export default GameCard

// 导出卡片头部组件
export const CardHeader: React.FC<{
  children: ReactNode
  className?: string
  icon?: ReactNode
}> = ({ children, className = '', icon }) => (
  <div className={`flex items-center gap-3 mb-4 ${className}`}>
    {icon && <div className="text-primary">{icon}</div>}
    {children}
  </div>
)

// 导出卡片标题组件
export const CardTitle: React.FC<{
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ children, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-base font-medium',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-bold'
  }

  return (
    <h3 className={`${sizeClasses[size]} text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  )
}

// 导出卡片内容组件
export const CardContent: React.FC<{
  children: ReactNode
  className?: string
}> = ({ children, className = '' }) => (
  <div className={`text-gray-600 dark:text-gray-300 ${className}`}>
    {children}
  </div>
)

// 导出卡片底部组件
export const CardFooter: React.FC<{
  children: ReactNode
  className?: string
}> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

// 导出卡片徽章组件
export const CardBadge: React.FC<{
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient'
  className?: string
  size?: 'sm' | 'md'
}> = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    error: 'bg-error/10 text-error border border-error/20',
    info: 'bg-info/10 text-info border border-info/20',
    gradient: 'bg-gradient-candy text-white'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  return (
    <span className={`inline-block rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}