<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// ============ ECharts 按需导入 ============
// 核心模块：仅导入 init()，替代全量 echarts 包
import * as echarts from 'echarts/core'

// 图表类型：只导入项目实际使用的 3 种图表
import { LineChart }  from 'echarts/charts'
import { BarChart }   from 'echarts/charts'
import { PieChart }   from 'echarts/charts'

// 功能组件：只导入图表配置中用到的组件
import { GridComponent }    from 'echarts/components'
import { TooltipComponent } from 'echarts/components'
import { LegendComponent }  from 'echarts/components'

// 渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 注册
echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
])
// ==========================================

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: String, default: '300px' }
})

const chartRef = ref(null)
let chart = null
let resizeTimer = null

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  chart.setOption(props.option, { notMerge: true })

  window.addEventListener('resize', handleResize)
}

// ✨ 防抖 resize：窗口拖拽每秒触发数十次，150ms 防抖保证只执行最后一次
const handleResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    chart?.resize()
  }, 150)
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimer) clearTimeout(resizeTimer)
  chart?.dispose()
  chart = null
})

// ✨ 优化 1：移除 deep: true → 浅引用对比就够
// 父组件 computed 每次数据变化返回新 option 对象引用，
// Vue 默认用 === 比较 watch 函数返回值，引用不同即触发回调，
// deep: true 的深层遍历在此场景下是纯开销。
//
// ✨ 优化 2：setOption(option, { notMerge: true })
// notMerge 模式直接用新配置替换旧配置，不清残留、不累积，比 merge 更稳
watch(
  () => props.option,
  (newOption) => {
    chart?.setOption(newOption, { notMerge: true })
  }
)
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: v-bind(height);
  min-height: 200px;
}
</style>
