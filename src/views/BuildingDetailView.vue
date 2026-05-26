<template>
  <!-- ✨ 骨架屏叠加层模式：building 初始有默认值，模板始终渲染 -->
  <div class="building-detail-view skel-wrapper" :class="{ 'skel-loaded': !loading }">
    <!-- ===== 骨架叠加层 ===== -->
    <div class="skel-overlay" v-if="loading">
      <!-- 页面头部骨架 -->
      <div class="page-header">
        <div class="header-left">
          <div class="skel-block" style="width:80px;height:36px;border-radius:var(--radius-md)"></div>
          <div class="title-group">
            <div class="skel-line skel-line-xl" style="width:160px"></div>
            <div class="skel-line skel-line-sm" style="width:200px;margin-top:4px"></div>
          </div>
        </div>
        <div class="skel-block" style="width:100px;height:38px;border-radius:var(--radius-md)"></div>
      </div>

      <!-- 指标卡片骨架 -->
      <div class="key-metrics">
        <div v-for="i in 4" :key="'bm-' + i" class="skel-card">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <div class="skel-circle" style="width:36px;height:36px"></div>
            <div class="skel-line skel-line-sm" style="width:60px"></div>
          </div>
          <div class="skel-line skel-line-xl" style="width:70%"></div>
          <div class="skel-line skel-line-sm" style="width:40%;margin-top:8px"></div>
        </div>
      </div>

      <!-- 图表骨架 -->
      <div class="charts-section">
        <div v-for="i in 2" :key="'bc-' + i" class="skel-chart">
          <div class="skel-chart-header">
            <div class="skel-line skel-line-md" style="width:110px"></div>
          </div>
          <div class="skel-block skel-chart-body" style="height:240px"></div>
        </div>
      </div>

      <!-- 能耗构成骨架 -->
      <div class="composition-section">
        <div class="skel-chart full">
          <div class="skel-chart-header">
            <div class="skel-line skel-line-md" style="width:100px"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div v-for="i in 4" :key="'comp-' + i" class="skel-block" style="padding:16px;background:var(--color-bg-tertiary)">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <div class="skel-line skel-line-sm" style="width:60px;background:var(--color-bg-primary)"></div>
                <div class="skel-line skel-line-md" style="width:30px;background:var(--color-bg-primary)"></div>
              </div>
              <div class="skel-line" style="height:8px;width:100%;border-radius:4px;background:var(--color-bg-primary)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 真实内容（始终渲染，加载中 opacity: 0.3） ===== -->
    <div class="skel-content">
      <div class="page-header">
        <div class="header-left">
          <button class="back-btn" @click="$router.back()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </button>
          <div class="title-group">
            <h2 class="page-title">{{ building.name || '---' }}</h2>
            <span class="building-meta">{{ building.floors || 0 }}层 · {{ building.area || 0 }}㎡</span>
          </div>
        </div>
        <div class="status-badge" :class="building.status || 'online'">
          {{ building.status === 'online' ? '在线运行中' : '离线' }}
        </div>
      </div>

      <!-- 关键指标 -->
      <div class="key-metrics">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon electric">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </span>
            <span class="metric-title">今日用电</span>
          </div>
          <div class="metric-value">
            <span class="value mono-number">{{ building.todayElectricity?.toFixed(1) ?? '--' }}</span>
            <span class="unit">kWh</span>
          </div>
          <div class="metric-change positive">+3.2% 较昨日</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon water">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </span>
            <span class="metric-title">今日用水</span>
          </div>
          <div class="metric-value">
            <span class="value mono-number">{{ building.todayWater?.toFixed(1) ?? '--' }}</span>
            <span class="unit">m³</span>
          </div>
          <div class="metric-change negative">-1.5% 较昨日</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon month">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </span>
            <span class="metric-title">本月用电</span>
          </div>
          <div class="metric-value">
            <span class="value mono-number">{{ building.monthlyElectricity?.toFixed(1) ?? '--' }}</span>
            <span class="unit">kWh</span>
          </div>
          <div class="metric-change positive">+2.8% 较上月</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon year">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </span>
            <span class="metric-title">年度用电</span>
          </div>
          <div class="metric-value">
            <span class="value mono-number">{{ building.yearlyElectricity?.toFixed(1) ?? '--' }}</span>
            <span class="unit">kWh</span>
          </div>
          <div class="metric-change neutral">年度累计</div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">24小时用电趋势</h3>
          </div>
          <LineChart :option="hourlyChartOption" height="280px" />
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">近30天用电趋势</h3>
          </div>
          <LineChart :option="dailyChartOption" height="280px" />
        </div>
      </div>

      <!-- 能耗构成 -->
      <div class="composition-section">
        <div class="chart-card full">
          <div class="chart-header">
            <h3 class="chart-title">能耗构成分析</h3>
          </div>
          <div class="composition-content">
            <div class="composition-item">
              <div class="comp-header">
                <span class="comp-label">空调系统</span>
                <span class="comp-value mono-number">45%</span>
              </div>
              <div class="comp-bar">
                <div class="comp-fill" style="width: 45%; background: #00D4FF;"></div>
              </div>
            </div>
            <div class="composition-item">
              <div class="comp-header">
                <span class="comp-label">照明系统</span>
                <span class="comp-value mono-number">25%</span>
              </div>
              <div class="comp-bar">
                <div class="comp-fill" style="width: 25%; background: #00FF88;"></div>
              </div>
            </div>
            <div class="composition-item">
              <div class="comp-header">
                <span class="comp-label">办公设备</span>
                <span class="comp-value mono-number">18%</span>
              </div>
              <div class="comp-bar">
                <div class="comp-fill" style="width: 18%; background: #FFB800;"></div>
              </div>
            </div>
            <div class="composition-item">
              <div class="comp-header">
                <span class="comp-label">其他设备</span>
                <span class="comp-value mono-number">12%</span>
              </div>
              <div class="comp-bar">
                <div class="comp-fill" style="width: 12%; background: #FF6B6B;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent, h } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/api'

// ── 异步加载图表组件，占位高度与真实图表精确一致以防 CLS ──
const ChartPlaceholder = {
  render() {
    return h('div', { class: 'async-chart-placeholder' }, [
      h('div', { class: 'skel-block', style: 'min-height:280px' })
    ])
  }
}

const LineChart = defineAsyncComponent({
  loader: () => import('@/components/charts/LineChart.vue'),
  loadingComponent: ChartPlaceholder
  // ★ 不设 delay：组件立即开始加载，不留空白间隙
})

const route = useRoute()
const loading = ref(true)

// ✨ 骨架屏需要模板始终渲染 → building 初始为默认对象而非 null
const building = ref({
  name: '',
  floors: 0,
  area: 0,
  status: 'online',
  todayElectricity: 0,
  todayWater: 0,
  monthlyElectricity: 0,
  yearlyElectricity: 0,
  power: 250
})
const hourlyData = ref([])
// ✨ 修复：将随机数据预计算存入 ref，computed 不再调用 Math.random()
const dailyTrendData = ref([])

// 确定性种子随机：相同输入永远产生相同输出，保证数据稳定
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// 生成稳定的30天趋势数据（基于楼栋ID确定性随机）
const generateDailyTrend = (buildingId, basePower) => {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round((basePower * 8 + seededRandom(buildingId * 100 + i) * 100) * 10) / 10
    })
  }
  return data
}

const loadBuilding = async (id) => {
  try {
    const numericId = parseInt(id)
    const res = await apiService.getBuildingDetail(numericId)
    building.value = res.data
    const hourlyRes = await apiService.getHourlyData()
    hourlyData.value = hourlyRes.data
    dailyTrendData.value = generateDailyTrend(numericId, building.value?.power || 250)
  } catch (error) {
    console.error('加载楼栋详情失败:', error)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) loadBuilding(newId)
}, { immediate: true })

const hourlyChartOption = computed(() => ({
  grid: { top: 30, right: 20, bottom: 30, left: 50 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderColor: '#2A3A4D',
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: 'category',
    data: hourlyData.value.map(d => d.hour),
    axisLine: { lineStyle: { color: '#2A3A4D' } },
    axisLabel: { color: '#8B9BB4', interval: 3 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#2A3A4D', type: 'dashed' } },
    axisLabel: { color: '#8B9BB4' }
  },
  series: [{
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { color: '#00D4FF', width: 2 },
    itemStyle: { color: '#00D4FF' },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
          { offset: 1, color: 'transparent' }
        ]
      }
    },
    data: hourlyData.value.map(d => d.electricity)
  }]
}))

// ✨ 修复：computed 只做纯计算引用，不再调用 Math.random()
const dailyChartOption = computed(() => ({
  grid: { top: 30, right: 20, bottom: 30, left: 50 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderColor: '#2A3A4D',
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: 'category',
    data: dailyTrendData.value.map(d => d.date.slice(5)),
    axisLine: { lineStyle: { color: '#2A3A4D' } },
    axisLabel: { color: '#8B9BB4', interval: 4 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#2A3A4D', type: 'dashed' } },
    axisLabel: { color: '#8B9BB4' }
  },
  series: [{
    type: 'bar',
    barWidth: '50%',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#00FF88' },
          { offset: 1, color: 'rgba(0, 255, 136, 0.3)' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    },
    data: dailyTrendData.value.map(d => d.value)
  }]
}))
</script>

<style scoped>
.building-detail-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 16px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.building-meta {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.status-badge {
  padding: 8px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
}

.status-badge.online {
  background: rgba(0, 255, 136, 0.1);
  color: var(--color-secondary);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.status-badge.offline {
  background: rgba(255, 107, 107, 0.1);
  color: var(--color-accent);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.key-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.metric-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.metric-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon svg {
  width: 20px;
  height: 20px;
}

.metric-icon.electric {
  background: rgba(0, 212, 255, 0.1);
  color: #00D4FF;
}

.metric-icon.water {
  background: rgba(0, 255, 136, 0.1);
  color: #00FF88;
}

.metric-icon.month {
  background: rgba(255, 184, 0, 0.1);
  color: #FFB800;
}

.metric-icon.year {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.metric-title {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: var(--spacing-sm);
}

.metric-value .value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.metric-value .unit {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.metric-change {
  font-size: 13px;
}

.metric-change.positive { color: var(--color-accent); }
.metric-change.negative { color: var(--color-secondary); }
.metric-change.neutral { color: var(--color-text-secondary); }

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.chart-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.chart-card.full {
  grid-column: 1 / -1;
}

.chart-header {
  margin-bottom: var(--spacing-md);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.composition-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.composition-item {
  padding: var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.comp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.comp-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.comp-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.comp-bar {
  height: 8px;
  background: var(--color-bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.comp-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-out;
}

@media (max-width: 1200px) {
  .key-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .key-metrics {
    grid-template-columns: 1fr;
  }
  
  .composition-content {
    grid-template-columns: 1fr;
  }
}

.async-chart-placeholder {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  min-height: 280px; /* 与 LineChart height=280px 保持一致，防止 CLS */
}
</style>
