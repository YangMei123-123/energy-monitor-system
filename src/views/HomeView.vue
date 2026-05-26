<template>
  <div class="home-view">
    <div class="page-header">
      <h2 class="page-title">数据总览</h2>
      <span class="page-subtitle">Campus Energy Dashboard</span>
    </div>

    <!-- ✨ 骨架屏叠加层模式：wrapper 内同时存在 skel-overlay + skel-content -->
    <!-- loading 为 false 时 skel-overlay opacity→0，真实内容 opacity→1 -->
    <!--
      与之前 v-if 切换的本质差异：
      - DOM 始终不变 → Lighthouse 不检测到布局变化
      - 纯 opacity CSS 过渡 → GPU 合成层，无重排
      - 骨架块无动画 → 每帧视觉一致 → SI 不扣分
    -->

    <!-- 数据卡片区域 -->
    <div class="skel-wrapper" :class="{ 'skel-loaded': !loading }">
      <!-- 骨架叠加层 -->
      <div class="skel-overlay">
        <div class="data-cards">
          <div v-for="i in 4" :key="'sc-' + i" class="skel-card">
            <div class="skel-circle skel-icon-sm"></div>
            <div class="skel-line skel-line-sm" style="width:50%"></div>
            <div class="skel-line skel-line-lg" style="width:70%"></div>
          </div>
        </div>
      </div>

      <!-- 真实内容 -->
      <div class="skel-content">
        <div class="data-cards">
          <DataCard
            title="今日用电量"
            :value="todayData.totalElectricity"
            unit="kWh"
            :change="todayData.electricityChange"
            :icon="electricIcon"
            :decimals="1"
          />
          <DataCard
            title="今日用水量"
            :value="todayData.totalWater"
            unit="m³"
            :change="todayData.waterChange"
            :icon="waterIcon"
            :decimals="1"
          />
          <DataCard
            title="在线设备"
            :value="onlineCount"
            unit="台"
            :icon="deviceIcon"
          />
          <DataCard
            title="用电峰值"
            :value="todayData.peakValue"
            unit="kW"
            :icon="peakIcon"
            :decimals="1"
          />
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="skel-wrapper" :class="{ 'skel-loaded': !loading }">
      <!-- 骨架叠加层 -->
      <div class="skel-overlay">
        <div class="charts-grid">
          <div class="skel-chart main-chart">
            <div class="skel-chart-header">
              <div class="skel-line skel-line-md" style="width:120px"></div>
            </div>
            <div class="skel-block skel-chart-body" style="height:320px"></div>
          </div>
          <div v-for="i in 2" :key="'sch-' + i" class="skel-chart">
            <div class="skel-chart-header">
              <div class="skel-line skel-line-md" style="width:100px"></div>
            </div>
            <div class="skel-block skel-chart-body" style="height:240px"></div>
          </div>
        </div>
      </div>

      <!-- 真实内容 -->
      <div class="skel-content">
        <div class="charts-grid">
          <div class="chart-card main-chart">
            <div class="chart-header">
              <h3 class="chart-title">近7天能耗趋势</h3>
              <div class="chart-tabs">
                <button
                  :class="{ active: trendType === 'electricity' }"
                  @click="trendType = 'electricity'"
                >用电量</button>
                <button
                  :class="{ active: trendType === 'water' }"
                  @click="trendType = 'water'"
                >用水量</button>
              </div>
            </div>
            <LineChart :option="trendChartOption" height="320px" />
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">今日用电分布</h3>
            </div>
            <LineChart :option="hourlyChartOption" height="280px" />
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">教学楼用电排行</h3>
            </div>
            <LineChart :option="rankingChartOption" height="280px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/api'
// ★ HomeView 是 LCP 首屏关键页，DataCard / LineChart 必须静态同步导入
//   骨架叠加层 (skel-overlay) 已提供完美的加载态体验，异步加载反而造成
//   "骨架→空白→占位→内容" 四阶段渲染，导致 CLS 上升、LCP 延迟
import DataCard from '@/components/DataCard.vue'
import LineChart from '@/components/charts/LineChart.vue'

const loading = ref(true)

const todayData = ref({
  totalElectricity: 0,
  totalWater: 0,
  electricityChange: 0,
  waterChange: 0,
  peakValue: 0
})

const buildings = ref([])
const dailyTrend = ref([])
const hourlyData = ref([])
const rankingData = ref([])
const trendType = ref('electricity')
const onlineCount = ref(0)

// 图标
const electricIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
const waterIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
const deviceIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>'
const peakIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'

// 获取数据
const loadData = async () => {
  try {
    const [todayRes, buildingsRes, trendRes, hourlyRes, rankingRes] = await Promise.all([
      apiService.getTodayData(),
      apiService.getBuildings(),
      apiService.getDailyTrend(7),
      apiService.getHourlyData(),
      apiService.getBuildingComparison()
    ])
    
    todayData.value = todayRes.data
    buildings.value = buildingsRes.data
    dailyTrend.value = trendRes.data
    hourlyData.value = hourlyRes.data
    rankingData.value = rankingRes.data
    onlineCount.value = buildingsRes.data.filter(b => b.status === 'online').length
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 能耗趋势图表配置
const trendChartOption = computed(() => {
  const data = trendType.value === 'electricity' 
    ? dailyTrend.value.map(d => d.electricity)
    : dailyTrend.value.map(d => d.water)
  const unit = trendType.value === 'electricity' ? 'kWh' : 'm³'
  
  return {
    grid: { top: 40, right: 20, bottom: 30, left: 50 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 35, 50, 0.95)',
      borderColor: '#2A3A4D',
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const { name, value } = params[0]
        return `${name}<br/>${unit}：<b>${value.toFixed(1)}</b>`
      }
    },
    xAxis: {
      type: 'category',
      data: dailyTrend.value.map(d => d.date.slice(5)),
      axisLine: { lineStyle: { color: '#2A3A4D' } },
      axisLabel: { color: '#8B9BB4' }
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
      symbolSize: 8,
      lineStyle: { 
        color: trendType.value === 'electricity' ? '#00D4FF' : '#00FF88',
        width: 3
      },
      itemStyle: { color: trendType.value === 'electricity' ? '#00D4FF' : '#00FF88' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: trendType.value === 'electricity' ? 'rgba(0, 212, 255, 0.3)' : 'rgba(0, 255, 136, 0.3)' },
            { offset: 1, color: 'transparent' }
          ]
        }
      },
      data: data
    }]
  }
})

// 今日用电分布图表配置
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
    type: 'bar',
    barWidth: '60%',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#00D4FF' },
          { offset: 1, color: 'rgba(0, 212, 255, 0.3)' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    },
    data: hourlyData.value.map(d => d.electricity)
  }]
}))

// 楼栋排行图表配置
const rankingChartOption = computed(() => ({
  grid: { top: 20, right: 80, bottom: 30, left: 80 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderColor: '#2A3A4D',
    textStyle: { color: '#fff' },
    axisPointer: { type: 'shadow' }
  },
  xAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#2A3A4D', type: 'dashed' } },
    axisLabel: { color: '#8B9BB4' }
  },
  yAxis: {
    type: 'category',
    data: rankingData.value.map(d => d.name).reverse(),
    axisLine: { show: false },
    axisLabel: {
      color: '#8B9BB4',
      width: 70,
      overflow: 'break',
      interval: 0
    }
  },
  series: [{
    type: 'bar',
    barWidth: '50%',
    itemStyle: {
      color: (params) => {
        const colors = ['#00D4FF', '#00C4EE', '#00B4DD', '#00A4CC', '#0094BB']
        return colors[params.dataIndex] || '#00D4FF'
      },
      borderRadius: [0, 4, 4, 0]
    },
    data: rankingData.value.map(d => d.electricity).reverse()
  }]
}))

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home-view {
  max-width: 1600px;
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

.data-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.chart-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.chart-card.main-chart {
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

.chart-tabs {
  display: flex;
  gap: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.chart-tabs button {
  padding: 6px 14px;
  font-size: 13px;
  color: var(--color-text-secondary);
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.chart-tabs button:hover {
  color: var(--color-text-primary);
}

.chart-tabs button.active {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

@media (max-width: 1200px) {
  .data-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.main-chart {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .data-cards {
    grid-template-columns: 1fr;
  }
}

</style>
