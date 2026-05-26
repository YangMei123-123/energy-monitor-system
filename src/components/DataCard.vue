<template>
  <div class="data-card" :class="{ loading: loading }">
    <div class="card-header">
      <span class="card-icon" v-html="icon"></span>
      <span class="card-title">{{ title }}</span>
    </div>
    
    <div class="card-body">
      <div class="card-value">
        <span class="value-number mono-number">{{ displayValue }}</span>
        <span class="value-unit">{{ unit }}</span>
      </div>
      
      <div class="card-change" v-if="change !== undefined" :class="changeClass">
        <span class="change-icon">{{ change >= 0 ? '↑' : '↓' }}</span>
        <span class="change-value">{{ Math.abs(change) }}%</span>
        <span class="change-text">较昨日</span>
      </div>
    </div>
    
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
    
    <div class="card-glow"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  unit: { type: String, default: '' },
  icon: { type: String, default: '' },
  change: { type: Number, default: undefined },
  loading: { type: Boolean, default: false },
  decimals: { type: Number, default: 2 }
})

const displayValue = ref(0)

const animateValue = (target) => {
  const start = displayValue.value
  const diff = target - start
  const duration = 1000
  const startTime = performance.now()
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    displayValue.value = start + diff * easeProgress
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

watch(() => props.value, (newVal) => {
  const numValue = typeof newVal === 'number' ? newVal : parseFloat(newVal)
  animateValue(numValue)
}, { immediate: true })

const changeClass = computed(() => ({
  'positive': props.change > 0,
  'negative': props.change < 0,
  'neutral': props.change === 0
}))

const formattedValue = computed(() => {
  return displayValue.value.toFixed(props.decimals)
})
</script>

<style scoped>
.data-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
}

.data-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.data-card:hover .card-glow {
  opacity: 1;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.card-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
}

.card-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.card-title {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.card-value {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.value-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.value-unit {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.card-change {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 13px;
}

.card-change.positive {
  color: var(--color-accent);
}

.card-change.negative {
  color: var(--color-secondary);
}

.card-change.neutral {
  color: var(--color-text-secondary);
}

.change-icon {
  font-weight: 600;
}

.card-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.data-card.loading .value-number {
  color: var(--color-text-secondary);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
