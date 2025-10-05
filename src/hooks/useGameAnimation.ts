import { useEffect, useState } from 'react'
import { useAnimation } from 'framer-motion'

// 游戏化动画钩子
export const useGameAnimation = () => {
  const controls = useAnimation()
  const [isAnimating, setIsAnimating] = useState(false)

  // 成功动画
  const playSuccess = async () => {
    setIsAnimating(true)
    await controls.start({
      scale: [1, 1.2, 0.9, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.3, 0.6, 1],
        ease: "easeInOut"
      }
    })
    setIsAnimating(false)
  }

  // 失败动画
  const playError = async () => {
    setIsAnimating(true)
    await controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut"
      }
    })
    setIsAnimating(false)
  }

  // 弹跳动画
  const playBounce = async () => {
    setIsAnimating(true)
    await controls.start({
      y: [0, -30, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: [0.4, 0, 0.2, 1]
      }
    })
    setIsAnimating(false)
  }

  // 脉冲动画
  const playPulse = async () => {
    setIsAnimating(true)
    await controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.3,
        repeat: 2,
        ease: "easeInOut"
      }
    })
    setIsAnimating(false)
  }

  // 闪光动画
  const playSparkle = async () => {
    setIsAnimating(true)
    await controls.start({
      opacity: [1, 0.6, 1],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.4,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    })
    setIsAnimating(false)
  }

  return {
    controls,
    isAnimating,
    playSuccess,
    playError,
    playBounce,
    playPulse,
    playSparkle
  }
}

// 连击效果钩子
export const useComboAnimation = () => {
  const [combo, setCombo] = useState(0)
  const [isComboActive, setIsComboActive] = useState(false)

  const incrementCombo = () => {
    setCombo(prev => prev + 1)
    setIsComboActive(true)

    // 3秒后重置连击
    setTimeout(() => {
      setIsComboActive(false)
      setCombo(0)
    }, 3000)
  }

  const resetCombo = () => {
    setCombo(0)
    setIsComboActive(false)
  }

  return {
    combo,
    isComboActive,
    incrementCombo,
    resetCombo
  }
}

// 等级提升动画钩子
export const useLevelUpAnimation = () => {
  const controls = useAnimation()
  const [showLevelUp, setShowLevelUp] = useState(false)

  const playLevelUp = async (newLevel: number) => {
    setShowLevelUp(true)

    // 播放动画序列
    await controls.start({
      scale: [0, 1.2, 1],
      rotate: [0, 360],
      opacity: [0, 1],
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    })

    // 3秒后隐藏
    setTimeout(() => {
      setShowLevelUp(false)
    }, 3000)
  }

  return {
    controls,
    showLevelUp,
    playLevelUp
  }
}

// 积分增长动画钩子
export const useScoreAnimation = (initialScore: number = 0) => {
  const [displayScore, setDisplayScore] = useState(initialScore)
  const [targetScore, setTargetScore] = useState(initialScore)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayScore === targetScore) {
      setIsAnimating(false)
      return
    }

    setIsAnimating(true)
    const difference = targetScore - displayScore
    const increment = difference / 20 // 分20步完成
    const timer = setInterval(() => {
      setDisplayScore(current => {
        const next = current + increment
        if ((increment > 0 && next >= targetScore) || (increment < 0 && next <= targetScore)) {
          clearInterval(timer)
          return targetScore
        }
        return Math.round(next)
      })
    }, 30) // 每30ms更新一次

    return () => clearInterval(timer)
  }, [targetScore, displayScore])

  const addScore = (points: number) => {
    setTargetScore(prev => prev + points)
  }

  return {
    displayScore,
    isAnimating,
    addScore
  }
}

// 粒子效果配置
export const particleEffects = {
  confetti: {
    particles: 30,
    colors: ['#FF6B9D', '#FFC800', '#58CC02', '#CE82FF', '#60A5FA'],
    spread: 50,
    duration: 1500
  },
  stars: {
    particles: 15,
    colors: ['#FFD700', '#FFC800'],
    spread: 30,
    duration: 1000
  },
  hearts: {
    particles: 10,
    colors: ['#FF6B9D', '#FF8FB3'],
    spread: 40,
    duration: 1200
  }
}