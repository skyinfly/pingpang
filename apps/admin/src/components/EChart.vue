<script setup lang="ts">
// Minimal ECharts wrapper. We pull only the core + the chart/component
// modules we actually use so the bundle doesn't ship the full ~1MB.
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';

echarts.use([
  LineChart,
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

const props = defineProps<{
  option: EChartsCoreOption;
  /** Container height in px. Defaults to 240. */
  height?: number;
}>();

const root = ref<HTMLDivElement | null>(null);
let instance: echarts.ECharts | null = null;

function ensureInstance() {
  if (!root.value) return null;
  if (!instance) instance = echarts.init(root.value);
  return instance;
}

function render() {
  const inst = ensureInstance();
  if (!inst) return;
  inst.setOption(props.option, true);
}

function handleResize() {
  instance?.resize();
}

onMounted(() => {
  render();
  // ResizeObserver beats window resize: the dashboard's grid changes the
  // container width when other tabs collapse/expand, not when the window
  // itself changes.
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    const ro = new ResizeObserver(handleResize);
    ro.observe(root.value);
    (root.value as unknown as { __ro?: ResizeObserver }).__ro = ro;
  }
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  const node = root.value as unknown as { __ro?: ResizeObserver } | null;
  node?.__ro?.disconnect();
  instance?.dispose();
  instance = null;
});

watch(() => props.option, render, { deep: true });
</script>

<template>
  <div ref="root" :style="`width:100%;height:${height ?? 240}px`"></div>
</template>
