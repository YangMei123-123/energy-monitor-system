<template>
  <div class="suggestions-view">
    <div class="page-header">
      <h2 class="page-title">节能建议</h2>
      <span class="page-subtitle">Energy Saving Recommendations</span>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value mono-number">{{ warningCount }}</span>
          <span class="stat-label">待处理警告</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value mono-number">{{ infoCount }}</span>
          <span class="stat-label">优化建议</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value mono-number">{{ successCount }}</span>
          <span class="stat-label">已完成优化</span>
        </div>
      </div>
      
      <div class="stat-card highlight">
        <div class="stat-icon potential">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value mono-number">{{ potentialSaving }}</span>
          <span class="stat-label">预估月节能(kWh)</span>
        </div>
      </div>
    </div>
    
    <!-- 建议列表 -->
    <div class="suggestions-list">
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion.id"
        class="suggestion-card"
        :class="suggestion.type"
      >
        <div class="suggestion-icon">
          <svg v-if="suggestion.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg v-else-if="suggestion.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        
        <div class="suggestion-content">
          <div class="suggestion-header">
            <h3 class="suggestion-title">{{ suggestion.title }}</h3>
            <span class="suggestion-badge" :class="suggestion.type">
              {{ getTypeLabel(suggestion.type) }}
            </span>
          </div>
          <p class="suggestion-desc">{{ suggestion.desc }}</p>
          <div class="suggestion-footer">
            <div class="savings">
              <span class="savings-icon">💡</span>
              <span class="savings-label">预计节能：</span>
              <span class="savings-value mono-number">{{ suggestion.savings }}</span>
            </div>
            <div class="actions">
              <button class="action-btn primary">立即处理</button>
              <button class="action-btn">稍后处理</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 节能小贴士 -->
    <div class="tips-section">
      <h3 class="section-title">节能小贴士</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon">🌡️</div>
          <h4 class="tip-title">空调温度设置</h4>
          <p class="tip-desc">夏季制冷温度建议设置在26°C以上，每调高1°C可节能约6%</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">💡</div>
          <h4 class="tip-title">照明管理</h4>
          <p class="tip-desc">充分利用自然光，人走灯灭。更换LED灯具可节能50%以上</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">🔌</div>
          <h4 class="tip-title">设备待机管理</h4>
          <p class="tip-desc">下班后关闭非必要设备，待机功耗虽小，长期累计也不可忽视</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon">📊</div>
          <h4 class="tip-title">定期监测</h4>
          <p class="tip-desc">通过本平台定期查看能耗数据，及时发现异常情况</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/api'

const suggestions = ref([])

const warningCount = computed(() => 
  suggestions.value.filter(s => s.type === 'warning').length
)

const infoCount = computed(() => 
  suggestions.value.filter(s => s.type === 'info').length
)

const successCount = computed(() => 
  suggestions.value.filter(s => s.type === 'success').length
)

const potentialSaving = computed(() => 850)

const getTypeLabel = (type) => {
  const labels = {
    warning: '紧急',
    info: '建议',
    success: '已完成'
  }
  return labels[type] || type
}

const loadSuggestions = async () => {
  try {
    const res = await apiService.getSuggestions()
    suggestions.value = res.data
  } catch (error) {
    console.error('加载建议失败:', error)
  }
}

onMounted(() => {
  loadSuggestions()
})
</script>

<style scoped>
.suggestions-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-card.highlight {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 136, 0.1));
  border-color: rgba(0, 212, 255, 0.3);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.warning {
  background: rgba(255, 107, 107, 0.1);
  color: var(--color-accent);
}

.stat-icon.info {
  background: rgba(0, 212, 255, 0.1);
  color: var(--color-primary);
}

.stat-icon.success {
  background: rgba(0, 255, 136, 0.1);
  color: var(--color-secondary);
}

.stat-icon.potential {
  background: rgba(255, 184, 0, 0.1);
  color: var(--color-warning);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.suggestion-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-lg);
  transition: all var(--transition-normal);
}

.suggestion-card:hover {
  border-color: var(--color-border);
  transform: translateX(4px);
}

.suggestion-card.warning {
  border-left: 4px solid var(--color-accent);
}

.suggestion-card.info {
  border-left: 4px solid var(--color-primary);
}

.suggestion-card.success {
  border-left: 4px solid var(--color-secondary);
}

.suggestion-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-icon svg {
  width: 20px;
  height: 20px;
}

.warning .suggestion-icon {
  background: rgba(255, 107, 107, 0.1);
  color: var(--color-accent);
}

.info .suggestion-icon {
  background: rgba(0, 212, 255, 0.1);
  color: var(--color-primary);
}

.success .suggestion-icon {
  background: rgba(0, 255, 136, 0.1);
  color: var(--color-secondary);
}

.suggestion-content {
  flex: 1;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.suggestion-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.suggestion-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.suggestion-badge.warning {
  background: rgba(255, 107, 107, 0.1);
  color: var(--color-accent);
}

.suggestion-badge.info {
  background: rgba(0, 212, 255, 0.1);
  color: var(--color-primary);
}

.suggestion-badge.success {
  background: rgba(0, 255, 136, 0.1);
  color: var(--color-secondary);
}

.suggestion-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.suggestion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.savings {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.savings-icon {
  font-size: 16px;
}

.savings-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.savings-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn.primary {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.action-btn.primary:hover {
  background: #00BEEE;
}

.tips-section {
  margin-top: var(--spacing-xl);
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.tip-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  text-align: center;
}

.tip-icon {
  font-size: 36px;
  margin-bottom: var(--spacing-md);
}

.tip-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.tip-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .suggestion-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
