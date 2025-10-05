'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 连击显示组件
interface ComboDisplayProps {
  combo: number
  isActive: boolean
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ combo, isActive }) => {
  if (!isActive || combo < 2) return null

  const getComboColor = () => {
    if (combo >= 10) return 'from-game-gold to-accent-yellow'
    if (combo >= 5) return 'from-accent-purple to-accent-pink'
    return 'from-primary to-secondary'
  }

  const getComboSize = () => {
    if (combo >= 10) return 'text-5xl'
    if (combo >= 5) return 'text-4xl'
    return 'text-3xl'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className={`bg-gradient-to-br ${getComboColor()} p-6 rounded-3xl shadow-2xl`}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-white text-center"
          >
            <div className={`${getComboSize()} font-bold`}>{combo}x</div>
            <div className="text-lg font-semibold">连击!</div>
          </motion.div>
        </div>
        {/* 爆炸粒子效果 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i * 60) * Math.PI / 180) * 100,
              y: Math.sin((i * 60) * Math.PI / 180) * 100,
              opacity: [1, 0]
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-candy rounded-full"
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

// 等级提升组件
interface LevelUpDisplayProps {
  show: boolean
  level: number
}

export const LevelUpDisplay: React.FC<LevelUpDisplayProps> = ({ show, level }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-gradient-to-br from-game-gold via-accent-yellow to-game-gold p-8 rounded-3xl shadow-2xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="text-white text-center"
            >
              <div className="text-6xl mb-2">🎉</div>
            </motion.div>
            <div className="text-white text-center">
              <div className="text-3xl font-bold mb-2">等级提升!</div>
              <div className="text-5xl font-black">Lv.{level}</div>
            </div>
          </div>
          {/* 星星粒子效果 */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * 45) * Math.PI / 180) * 150,
                y: Math.sin((i * 45) * Math.PI / 180) * 150,
                rotate: [0, 360]
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                delay: i * 0.1
              }}
              className="absolute top-1/2 left-1/2 text-4xl"
            >
              ⭐
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 积分飞入动画组件
interface ScorePopupProps {
  points: number
  x: number
  y: number
  onComplete?: () => void
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ points, x, y, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const isPositive = points > 0

  return (
    <motion.div
      initial={{ x, y, scale: 0, opacity: 0 }}
      animate={{
        y: y - 50,
        scale: [0, 1.5, 1],
        opacity: [0, 1, 0]
      }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed z-50 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className={`font-bold text-2xl ${isPositive ? 'text-success' : 'text-error'}`}>
        {isPositive ? '+' : ''}{points}
      </div>
    </motion.div>
  )
}

// 成就解锁通知组件
interface AchievementPopupProps {
  title: string
  description: string
  icon: string
  show: boolean
  onClose?: () => void
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  title,
  description,
  icon,
  show,
  onClose
}) => {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-20 right-4 z-50"
        >
          <div className="bg-gradient-candy p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1 }}
              className="text-4xl"
            >
              {icon}
            </motion.div>
            <div className="flex-1 text-white">
              <div className="text-sm opacity-90 font-medium">成就解锁!</div>
              <div className="text-lg font-bold">{title}</div>
              <div className="text-sm opacity-90">{description}</div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white text-xl"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 粒子爆炸效果组件
interface ParticleExplosionProps {
  trigger: boolean
  particleCount?: number
  colors?: string[]
  spread?: number
  x?: number
  y?: number
}

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
  trigger,
  particleCount = 20,
  colors = ['#FF6B9D', '#FFC800', '#58CC02', '#CE82FF'],
  spread = 100,
  x = window.innerWidth / 2,
  y = window.innerHeight / 2
}) => {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (360 / particleCount) * i,
        distance: spread + Math.random() * spread
      }))
      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
      }, 1500)
    }
  }, [trigger, particleCount, colors, spread])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ x, y, scale: 0, opacity: 1 }}
          animate={{
            x: x + Math.cos(particle.angle * Math.PI / 180) * particle.distance,
            y: y + Math.sin(particle.angle * Math.PI / 180) * particle.distance,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  )
}

// 波纹效果组件
interface RippleEffectProps {
  x: number
  y: number
  color?: string
  size?: number
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  x,
  y,
  color = 'rgba(102, 126, 234, 0.3)',
  size = 100
}) => {
  const [ripples, setRipples] = useState<any[]>([])

  const addRipple = () => {
    const newRipple = {
      id: Date.now(),
      x,
      y
    }
    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 1000)
  }

  useEffect(() => {
    addRipple()
  }, [x, y])

  return (
    <>
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed pointer-events-none"
          style={{
            left: ripple.x - size / 2,
            top: ripple.y - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color
          }}
        />
      ))}
    </>
  )
}