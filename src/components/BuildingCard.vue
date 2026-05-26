<template>
  <div class="building-card" @click="$emit('click', building)">
    <div class="card-header">
      <div class="building-info">
        <h3 class="building-name">{{ building.name }}</h3>
        <span class="building-meta">{{ building.floors }}层 · {{ building.area }}㎡</span>
      </div>
      <div class="status-badge" :class="building.status">
        {{ building.status === 'online' ? '在线' : '离线' }}
      </div>
    </div>
    
    <div class="card-body">
      <div class="power-display">
        <div class="power-value">
          <span class="value mono-number">{{ building.power }}</span>
          <span class="unit">kW</span>
        </div>
        <span class="power-label">实时功率</span>
      </div>
      
      <div class="mini-chart" ref="chartRef"></div>
    </div>
    
    <div class="card-footer">
      <span class="view-detail">查看详情 →</span>
    </div>
    
    <div class="card-border"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, GridComponent, CanvasRenderer])

defineProps({
  building: { type: Object, required: true }
})

defineEmits(['click'])

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  const option = {
    grid: { top: 5, right: 5, bottom: 5, left: 5 },
    xAxis: {
      type: 'category',
      show: false,
      data: Array.from({ length: 12 }, (_, i) => i)
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#00D4FF',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
          { offset: 1, color: 'rgba(0, 212, 255, 0)' }
        ])
      },
      data: [65, 78, 90, 85, 92, 88, 95, 100, 92, 88, 80, 72]
    }]
  }
  
  chart.setOption(option)
}

onMounted(() => {
  initChart()
})

watch(() => chartRef.value, () => {
  if (chartRef.value && !chart) {
    initChart()
  }
})
</script>

<style scoped>
.building-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
}

.building-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.building-card:hover .card-border {
  opacity: 1;
}

.building-card:hover .view-detail {
  color: var(--color-primary);
}

.card-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.building-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.building-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.online {
  background: rgba(0, 255, 136, 0.1);
  color: var(--color-secondary);
}

.status-badge.offline {
  background: rgba(255, 107, 107, 0.1);
  color: var(--color-accent);
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.power-display {
  display: flex;
  flex-direction: column;
}

.power-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.power-value .value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
}

.power-value .unit {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.power-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.mini-chart {
  width: 100px;
  height: 40px;
}

.card-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.view-detail {
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}
</style>
