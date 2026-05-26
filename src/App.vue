<template>
  <div class="app-container">
    <AppHeader />
    <div class="app-main">
      <AppNav />
      <main class="app-content">
        <!-- ✨ keep-alive: 首页和列表页缓存组件实例 -->
        <!-- 切走再回来时直接复用，无需重新 loadData() + 重绘 ECharts -->
        <router-view v-slot="{ Component }">
          <keep-alive :include="['HomeView', 'BuildingListView']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppNav from '@/components/AppNav.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
