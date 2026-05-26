<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <svg viewBox="0 0 40 40" class="logo-icon">
          <circle cx="20" cy="20" r="18" fill="none" stroke="url(#logoGrad)" stroke-width="2"/>
          <path d="M20 8 L20 20 L28 26" fill="none" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="20" cy="20" r="3" fill="url(#logoGrad)"/>
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00D4FF"/>
              <stop offset="100%" stop-color="#00FF88"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="header-title">
        <h1>校园能耗可视化平台</h1>
        <span class="subtitle">Campus Energy Management System</span>
      </div>
    </div>
    
    <div class="header-center">
      <div class="time-display">
        <div class="date">{{ currentDate }}</div>
        <div class="time mono-number">{{ currentTime }}</div>
      </div>
    </div>
    
    <div class="header-right">
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
        <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
      <div class="weather-info">
        <span class="weather-icon">☀️</span>
        <span class="weather-text">晴 26°C</span>
      </div>
      <div class="user-info">
        <div class="user-avatar">
          <span>管</span>
        </div>
        <div class="user-detail">
          <span class="user-name">管理员</span>
          <span class="user-role">后勤部</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const currentTime = ref('')
const currentDate = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.header {
  height: 72px;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo {
  width: 40px;
  height: 40px;
}

.logo-icon {
  width: 100%;
  height: 100%;
}

.header-title h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 2px;
}

.header-title .subtitle {
  font-size: 11px;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.time-display {
  text-align: center;
}

.time-display .date {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}

.time-display .time {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.theme-toggle:hover {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.weather-icon {
  font-size: 20px;
}

.weather-text {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-bg-primary);
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.user-role {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
