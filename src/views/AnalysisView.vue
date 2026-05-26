<template>
  <!-- ✨ 骨架屏叠加层模式 -->
  <div class="analysis-view skel-wrapper" :class="{ 'skel-loaded': !loading }">
    <!-- ===== 骨架叠加层 ===== -->
    <div class="skel-overlay" v-if="loading">
      <!-- 页面头部骨架 -->
      <div class="page-header">
        <div class="header-left">
          <div class="skel-line skel-line-xl" style="width:120px"></div>
          <div class="skel-line skel-line-sm" style="width:100px;margin-top:4px"></div>
        </div>
        <div style="display:flex;gap:4px;background:var(--color-bg-secondary);padding:4px;border-radius:var(--radius-md);border:1px solid var(--color-border)">
          <div v-for="i in 4" :key="'tab-' + i" class="skel-block" style="width:52px;height:40px;border-radius:var(--radius-sm)"></div>
        </div>
      </div>

      <!-- 对比卡片骨架 -->
      <div class="comparison-cards">
        <div v-for="i in 3" :key="'ac-' + i" class="skel-card" style="padding:var(--spacing-xl)">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px">
            <div class="skel-line skel-line-sm" style="width:80px"></div>
            <div class="skel-block" style="width:50px;height:22px;border-radius:12px"></div>
          </div>
          <div class="skel-line skel-line-xl" style="width:65%;margin-bottom:8px"></div>
          <div class="skel-line skel-line-sm" style="width:45%"></div>
        </div>
      </div>

      <!-- 图表区域骨架 -->
      <div class="charts-grid">
        <!-- 大图表 -->
        <div class="skel-chart large">
          <div class="skel-chart-header">
            <div class="skel-line skel-line-md" style="width:110px"></div>
          </div>
          <div class="skel-block skel-chart-body" style="height:350px"></div>
        </div>
        <!-- 饼图 -->
        <div class="skel-chart">
          <div class="skel-chart-header">
            <div class="skel-line skel-line-md" style="width:100px"></div>
          </div>
          <div class="skel-block skel-chart-body" style="height:260px"></div>
        </div>
        <!-- 柱状图 -->
        <div class="skel-chart">
          <div class="skel-chart-header">
            <div class="skel-line skel-line-md" style="width:110px"></div>
          </div>
          <div class="skel-block skel-chart-body" style="height:260px"></div>
        </div>
        <!-- 数据表格骨架 -->
        <div class="skel-chart full">
          <div class="skel-chart-header">
            <div class="skel-line skel-line-md" style="width:130px"></div>
          </div>
          <div style="overflow-x:auto">
            <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1fr;gap:1px;background:var(--color-border)">
              <div v-for="i in 5" :key="'th-' + i" class="skel-block" style="padding:12px;background:var(--color-bg-tertiary);border-radius:0"></div>
              <template v-for="row in 5" :key="'tr-' + row">
                <div v-for="col in 5" :key="'td-' + row + '-' + col" class="skel-line skel-line-sm" style="padding:10px;background:var(--color-bg-secondary);border-radius:0;height:auto;min-height:36px"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 真实内容（始终渲染） ===== -->
    <div class="skel-content">
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">能耗分析</h2>
          <span class="page-subtitle">Energy Analysis</span>
        </div>
        <div class="time-selector">
          <button 
            v-for="item in timeOptions" 
            :key="item.value"
            :class="{ active: timeRange === item.value }"
            @click="timeRange = item.value"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
      
      <!-- 对比卡片 -->
      <div class="comparison-cards">
        <div class="compare-card">
          <div class="compare-header">
            <span class="compare-label">用电总量</span>
            <span class="compare-badge electricity">电力</span>
          </div>
          <div class="compare-value">
            <span class="value mono-number">{{ totalElectricity.toFixed(0) }}</span>
            <span class="unit">kWh</span>
          </div>
          <div class="compare-trend">
            <span class="trend-icon up">↑</span>
            <span class="trend-value">+5.2%</span>
            <span class="trend-text">较上期</span>
          </div>
        </div>
        
        <div class="compare-card">
          <div class="compare-header">
            <span class="compare-label">用水总量</span>
            <span class="compare-badge water">水务</span>
          </div>
          <div class="compare-value">
            <span class="value mono-number">{{ totalWater.toFixed(0) }}</span>
            <span class="unit">m³</span>
          </div>
          <div class="compare-trend">
            <span class="trend-icon down">↓</span>
            <span class="trend-value">-2.1%</span>
            <span class="trend-text">较上期</span>
          </div>
        </div>
        
        <div class="compare-card">
          <div class="compare-header">
            <span class="compare-label">单位面积能耗</span>
            <span class="compare-badge area">效率</span>
          </div>
          <div class="compare-value">
            <span class="value mono-number">{{ unitAreaConsumption.toFixed(1) }}</span>
            <span class="unit">kWh/m²</span>
          </div>
          <div class="compare-trend">
            <span class="trend-icon neutral">—</span>
            <span class="trend-value">0%</span>
            <span class="trend-text">较上期</span>
          </div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-grid">
        <div class="chart-card large">
          <div class="chart-header">
            <h3 class="chart-title">能耗趋势对比</h3>
            <div class="legend">
              <span class="legend-item">
                <span class="dot electric"></span>用电量
              </span>
              <span class="legend-item">
                <span class="dot water"></span>用水量
              </span>
            </div>
          </div>
          <LineChart :option="trendChartOption" height="350px" />
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">各楼栋用电占比</h3>
          </div>
          <LineChart :option="pieChartOption" height="300px" />
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">用电峰值时段分布</h3>
          </div>
          <LineChart :option="peakChartOption" height="300px" />
        </div>
        
        <div class="chart-card full">
          <div class="chart-header">
            <h3 class="chart-title">各教学楼月度用电明细</h3>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>教学楼</th>
                  <th>本月用电(kWh)</th>
                  <th>上月用电(kWh)</th>
                  <th>环比变化</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in buildingData" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td class="mono-number">{{ item.current.toFixed(1) }}</td>
                  <td class="mono-number">{{ item.previous.toFixed(1) }}</td>
                  <td :class="item.change >= 0 ? 'positive' : 'negative'">
                    <span class="change-tag">{{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(1) }}%</span>
                  </td>
                  <td>
                    <div class="progress-cell">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: item.percent + '%' }"></div>
                      </div>
                      <span class="progress-text">{{ item.percent.toFixed(1) }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent, h } from 'vue'
import { apiService } from '@/api'

// ── 异步加载图表组件，占位高度匹配最大图表 (350px) ──
const ChartPlaceholder = {
  render() {
    return h('div', { class: 'async-chart-placeholder' }, [
      h('div', { class: 'skel-block', style: 'min-height:300px' })
    ])
  }
}

const LineChart = defineAsyncComponent({
  loader: () => import('@/components/charts/LineChart.vue'),
  loadingComponent: ChartPlaceholder
  // ★ 不设 delay：组件立即开始加载
})

const timeRange = ref('month')
const timeOptions = [
  { label: '日报', value: 'day' },
  { label: '周报', value: 'week' },
  { label: '月报', value: 'month' },
  { label: '年报', value: 'year' }
]

const loading = ref(true)
const trendData = ref([])
const rankingData = ref([])
// ✨ 修复：预计算稳定数据存入 ref，computed 不再调用 Math.random()
const stableBuildingData = ref([])
const peakValues = ref([])

// 确定性种子随机：相同输入永远产生相同输出
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// 计算数据
const totalElectricity = computed(() => 
  trendData.value.reduce((sum, d) => sum + d.electricity, 0)
)

const totalWater = computed(() => 
  trendData.value.reduce((sum, d) => sum + d.water, 0)
)

const unitAreaConsumption = computed(() => 
  totalElectricity.value / 75000
)

// ✨ 修复：buildingData 现在引用预计算的稳定数据，不再调用 Math.random()
const buildingData = computed(() => stableBuildingData.value)

// 获取数据
const loadData = async () => {
  try {
    const [trendRes, rankingRes] = await Promise.all([
      apiService.getMonthlyTrend(12),
      apiService.getBuildingComparison()
    ])
    trendData.value = trendRes.data
    rankingData.value = rankingRes.data

    // ✨ 数据加载完成后，一次性计算稳定的表格数据和峰值时段数据
    const totalElec = trendRes.data.reduce((sum, d) => sum + d.electricity, 0)
    stableBuildingData.value = rankingRes.data.map((b, idx) => ({
      name: b.name,
      current: b.electricity,
      previous: b.electricity * (0.9 + seededRandom(idx * 10 + 1) * 0.2),
      change: (seededRandom(idx * 10 + 2) - 0.5) * 20,
      percent: (b.electricity / totalElec) * 100
    }))

    // ✨ 一次性生成稳定的峰值时段值
    peakValues.value = Array.from({ length: 24 }, (_, i) => {
      if (i >= 7 && i <= 9)   return Math.round(60 + seededRandom(i * 100 + 3) * 30)
      if (i >= 10 && i <= 12) return Math.round(90 + seededRandom(i * 100 + 4) * 20)
      if (i >= 14 && i <= 17) return Math.round(75 + seededRandom(i * 100 + 5) * 25)
      if (i >= 18 && i <= 21) return Math.round(55 + seededRandom(i * 100 + 6) * 30)
      return Math.round(20 + seededRandom(i * 100 + 7) * 20)
    })
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 趋势图表配置
const trendChartOption = computed(() => ({
  grid: { top: 50, right: 40, bottom: 30, left: 60 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderColor: '#2A3A4D',
    textStyle: { color: '#fff' }
  },
  legend: {
    top: 10,
    right: 10,
    textStyle: { color: '#8B9BB4' },
    data: ['用电量', '用水量']
  },
  xAxis: {
    type: 'category',
    data: trendData.value.map(d => d.month),
    axisLine: { lineStyle: { color: '#2A3A4D' } },
    axisLabel: { color: '#8B9BB4' }
  },
  yAxis: [
    {
      type: 'value',
      name: 'kWh',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#2A3A4D', type: 'dashed' } },
      axisLabel: { color: '#8B9BB4' }
    },
    {
      type: 'value',
      name: 'm³',
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { color: '#8B9BB4' }
    }
  ],
  series: [
    {
      name: '用电量',
      type: 'line',
      smooth: true,
      yAxisIndex: 0,
      lineStyle: { color: '#00D4FF', width: 3 },
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
      data: trendData.value.map(d => d.electricity)
    },
    {
      name: '用水量',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      lineStyle: { color: '#00FF88', width: 3 },
      itemStyle: { color: '#00FF88' },
      data: trendData.value.map(d => d.water)
    }
  ]
}))

// 饼图配置
const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderColor: '#2A3A4D',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c} kWh ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: '#8B9BB4' }
  },
  color: ['#00D4FF', '#00FF88', '#FFB800', '#FF6B6B', '#9B59B6'],
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: {
      label: { show: false }
    },
    data: rankingData.value.map(b => ({ name: b.name, value: b.electricity }))
  }]
}))

// ✨ 修复：峰值时段图表直接引用预计算的稳定数据
const peakChartOption = computed(() => ({
  grid: { top: 20, right: 20, bottom: 30, left: 40 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderColor: '#2A3A4D',
    textStyle: { color: '#fff' }
  },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
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
    type: 'bar',
    barWidth: '80%',
    itemStyle: {
      color: (params) => {
        const hour = params.dataIndex
        if (hour >= 10 && hour <= 12) return '#FF6B6B'
        if (hour >= 7 && hour <= 9) return '#FFB800'
        if (hour >= 14 && hour <= 17) return '#FFB800'
        return '#00D4FF'
      },
      borderRadius: [4, 4, 0, 0]
    },
    data: peakValues.value
  }]
}))

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.analysis-view {
  max-width: 1600px;
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

.time-selector {
  display: flex;
  gap: 4px;
  background: var(--color-bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.time-selector button {
  padding: 10px 20px;
  font-size: 14px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.time-selector button:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
}

.time-selector button.active {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.comparison-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.compare-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.compare-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.compare-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.compare-badge.electricity {
  background: rgba(0, 212, 255, 0.1);
  color: #00D4FF;
}

.compare-badge.water {
  background: rgba(0, 255, 136, 0.1);
  color: #00FF88;
}

.compare-badge.area {
  background: rgba(255, 184, 0, 0.1);
  color: #FFB800;
}

.compare-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: var(--spacing-sm);
}

.compare-value .value {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.compare-value .unit {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.compare-trend {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 13px;
}

.trend-icon {
  font-weight: 600;
}

.trend-icon.up { color: var(--color-accent); }
.trend-icon.down { color: var(--color-secondary); }
.trend-icon.neutral { color: var(--color-text-secondary); }

.trend-value {
  color: var(--color-text-primary);
  font-weight: 500;
}

.trend-text {
  color: var(--color-text-secondary);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.chart-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.chart-card.large {
  grid-column: 1 / -1;
}

.chart-card.full {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.legend {
  display: flex;
  gap: var(--spacing-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.electric { background: #00D4FF; }
.dot.water { background: #00FF88; }

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
}

.data-table td {
  font-size: 14px;
  color: var(--color-text-primary);
}

.data-table .positive { color: var(--color-accent); }
.data-table .negative { color: var(--color-secondary); }

.change-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.positive .change-tag {
  background: rgba(255, 107, 107, 0.1);
}

.negative .change-tag {
  background: rgba(0, 255, 136, 0.1);
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-bar {
  width: 100px;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 3px;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 45px;
}

@media (max-width: 1200px) {
  .comparison-cards {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.large {
    grid-column: 1;
  }
}

.async-chart-placeholder {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  min-height: 300px; /* 匹配图表的 chart-card 最小高度，防止 CLS */
}
</style>
