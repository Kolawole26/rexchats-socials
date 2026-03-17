<template>
  <div class="w-full">
    <Chart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="w-full"
    />
    <!-- <div class=" flex items-center gap-x-6 justify-center">
      <div v-for="(label, index) in labels" :key="index" class="flex items-center mt-6 mb-2 text-[#333333] dark:text-white">
        <div class="w-4 h-4 mr-3" :style="`background-color: ${colors[index]}`"></div>
        <p class="capitalize font-medium text-xs ">{{ label }}</p>
    </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    required: true,
  },
});

// Local refs to handle prop changes
const localChartData = ref(props.chartData);
const localChartOptions = ref(props.chartOptions);

// Watch for prop changes and update local refs
watch(
  () => props.chartData,
  (newData) => {
    localChartData.value = newData;
  }
);

watch(
  () => props.chartOptions,
  (newOptions) => {
    localChartOptions.value = newOptions;
  }
);
</script>

