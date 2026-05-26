<template>
  <nav class="nav">
    <div class="nav-menu">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-text">{{ item.name }}</span>
      </router-link>
    </div>
    
    <div class="nav-footer">
      <div class="nav-status">
        <span class="status-dot online"></span>
        <span class="status-text">系统正常</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  {
    path: '/',
    name: '首页总览',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
  },
  {
    path: '/buildings',
    name: '教学楼管理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1"/></svg>'
  },
  {
    path: '/analysis',
    name: '能耗分析',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>'
  },
  {
    path: '/suggestions',
    name: '节能建议',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.nav {
  width: 200px;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  flex-shrink: 0;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all var(--transition-normal);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--color-primary);
  transform: scaleY(0);
  transition: transform var(--transition-normal);
}

.nav-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.1), transparent);
  color: var(--color-primary);
}

.nav-item.active::before {
  transform: scaleY(1);
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

.nav-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.nav-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-secondary);
}

.status-dot.online {
  background: var(--color-secondary);
  box-shadow: 0 0 8px var(--color-secondary);
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
