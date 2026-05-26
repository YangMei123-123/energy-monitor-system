import { ref, watch } from 'vue'

const isDark = ref(true)

// 从 localStorage 恢复主题
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  isDark.value = savedTheme === 'dark'
}

// 监听主题变化，保存到 localStorage
watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
})

// 初始化主题
document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme
  }
}

export default useTheme
