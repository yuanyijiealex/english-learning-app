'use client'

import React, { ReactNode } from 'react'

interface GameButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'gradient' | 'glass' | 'neon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  animate?: boolean
}

const GameButton: React.FC<GameButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  animate = true
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-base rounded-2xl',
    lg: 'px-7 py-3 text-lg rounded-2xl',
    xl: 'px-9 py-4 text-xl rounded-3xl'
  }

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-600 text-white shadow-game-button',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white shadow-game-button',
    success: 'bg-success hover:bg-success/90 text-white shadow-game-button',
    warning: 'bg-warning hover:bg-warning/90 text-gray-900 shadow-game-button',
    gradient: 'bg-gradient-candy hover:brightness-110 text-white shadow-xl',
    glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 text-gray-900 dark:text-white shadow-glass',
    neon: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-neon transition-all'
  }

  const baseClasses = `
    font-semibold
    transition-all
    duration-200
    ${animate ? 'transform active:scale-95' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}
    flex
    items-center
    justify-center
    gap-2
  `

  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  )
}

export default GameButton

// 导出悬浮动作按钮组件
export const FloatingActionButton: React.FC<{
  children: ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
  variant?: 'primary' | 'secondary' | 'gradient'
}> = ({ children, onClick, position = 'bottom-right', className = '', variant = 'primary' }) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-20 right-6',
    'top-left': 'fixed top-20 left-6'
  }

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-600 text-white',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white',
    gradient: 'bg-gradient-candy hover:brightness-110 text-white'
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${positionClasses[position]}
        ${variantClasses[variant]}
        w-14 h-14
        rounded-full
        shadow-xl
        hover:shadow-2xl
        hover:scale-110
        active:scale-95
        transition-all
        duration-200
        z-50
        flex
        items-center
        justify-center
        ${className}
      `}
    >
      {children}
    </button>
  )
}

// 导出图标按钮组件
export const IconButton: React.FC<{
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}> = ({ children, onClick, variant = 'default', size = 'md', className = '', disabled = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300',
    primary: 'bg-primary/10 hover:bg-primary/20 text-primary',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl
        flex
        items-center
        justify-center
        transition-all
        duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}