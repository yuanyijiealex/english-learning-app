/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // 活力糖果色系 - 主题色
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          DEFAULT: 'var(--primary)',
        },
        // 辅助色
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          DEFAULT: 'var(--secondary)',
        },
        // 强调色
        accent: {
          purple: 'var(--accent-purple)',
          pink: 'var(--accent-pink)',
          mint: 'var(--accent-mint)',
          yellow: 'var(--accent-yellow)',
          orange: 'var(--accent-orange)',
          coral: 'var(--accent-coral)',
        },
        // 功能色
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        // 游戏化元素色彩
        game: {
          gold: 'var(--game-gold)',
          silver: 'var(--game-silver)',
          bronze: 'var(--game-bronze)',
          xp: 'var(--game-xp)',
          streak: 'var(--game-streak)',
        }
      },
      // 圆角配置 - 游戏化大圆角
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      // 阴影效果 - 新拟态风格
      boxShadow: {
        'game-card': 'var(--shadow-game-card)',
        'game-button': 'var(--shadow-game-button)',
        'game-inset': 'var(--shadow-game-inset)',
        'glass': 'var(--shadow-glass)',
      },
      // 动画效果
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.6)' },
        },
      },
      // 背景渐变
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-candy': 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-pink) 50%, var(--accent-yellow) 100%)',
        'gradient-sunset': 'linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-coral) 50%, var(--accent-pink) 100%)',
        'gradient-ocean': 'linear-gradient(135deg, var(--primary) 0%, var(--accent-mint) 50%, var(--secondary) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      // 模糊效果
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}