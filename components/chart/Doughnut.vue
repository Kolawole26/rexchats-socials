<template>
  <div class="flex flex-col items-center gap-6">
    <div class="w-full max-w-[360px]">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full" />
    </div>

    <div class="w-full flex flex-wrap gap-x-6 gap-y-4">
      <div v-for="(label, index) in labels" :key="index" class="flex items-center gap-2">
        <span
          class="w-3 h-3 rounded-sm"
          :style="`background-color: ${colors[index]}`"
          aria-hidden="true"
        />
        <p class="body-small text-neutral-primary">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
  }
})
</script>
