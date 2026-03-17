<template>
    <div class="w-full">
      <Chart
        type="pie"
        :data="chartData"
        :options="chartOptions"
        class="w-full"
      />
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
  
