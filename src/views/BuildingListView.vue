<template>
  <div class="building-list-view">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">教学楼管理</h2>
        <span class="page-subtitle">Building Management</span>
      </div>
      <div class="header-right">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索教学楼..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <button 
            :class="{ active: statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >全部</button>
          <button 
            :class="{ active: statusFilter === 'online' }"
            @click="statusFilter = 'online'"
          >在线</button>
          <button 
            :class="{ active: statusFilter === 'offline' }"
            @click="statusFilter = 'offline'"
          >离线</button>
        </div>
      </div>
    </div>
    
    <div class="buildings-grid">
      <BuildingCard 
        v-for="building in filteredBuildings" 
        :key="building.id"
        :building="building"
        @click="goToDetail"
      />
    </div>
    
    <div v-if="filteredBuildings.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
        <path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6M9 9h1M14 9h1M9 13h1M14 13h1"/>
      </svg>
      <p>未找到匹配的教学楼</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/api'

// ── 异步加载 BuildingCard：占位高度匹配 BuildingCard 实际高度 ──
const CardPlaceholder = {
  render() {
    return h('div', { class: 'async-card-placeholder' }, [
      h('div', { class: 'skel-block', style: 'min-height:220px' })
    ])
  }
}

const BuildingCard = defineAsyncComponent({
  loader: () => import('@/components/BuildingCard.vue'),
  loadingComponent: CardPlaceholder
  // ★ 不设 delay
})

const router = useRouter()
const buildings = ref([])
const searchKeyword = ref('')
const statusFilter = ref('all')

const loadBuildings = async () => {
  try {
    const res = await apiService.getBuildings()
    buildings.value = res.data
  } catch (error) {
    console.error('加载教学楼列表失败:', error)
  }
}

const filteredBuildings = computed(() => {
  return buildings.value.filter(building => {
    const matchSearch = building.name.includes(searchKeyword.value)
    const matchStatus = statusFilter.value === 'all' || building.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

const goToDetail = (building) => {
  router.push(`/buildings/${building.id}`)
}

onMounted(() => {
  loadBuildings()
})
</script>

<style scoped>
.building-list-view {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  letter-spacing: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  transition: border-color var(--transition-fast);
}

.search-box:focus-within {
  border-color: var(--color-primary);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
}

.search-input {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 14px;
  width: 180px;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.filter-group {
  display: flex;
  gap: 4px;
  background: var(--color-bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.filter-group button {
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.filter-group button:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
}

.filter-group button.active {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.buildings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  color: var(--color-text-secondary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }
  
  .header-right {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-group {
    justify-content: center;
  }
}

.async-card-placeholder {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  min-height: 220px; /* 匹配 BuildingCard 卡片高度，防止 CLS */
}
</style>
