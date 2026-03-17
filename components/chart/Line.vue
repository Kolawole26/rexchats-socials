<template>
  <div :class="['w-full', heightClass]">
    <Chart type="line" :data="chartData" :options="chartOptions" class="w-full h-full" />
  </div>
</template>

<script setup>
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    required: true
  },
  heightClass: {
    type: String,
    default: 'h-[420px]'
  }
})
</script>
