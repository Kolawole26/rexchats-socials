<template>
  <section class="flex flex-col gap-6">
    <section class="flex items-start justify-between gap-4 flex-wrap">
      <div class="min-w-0">
        <h4 class="text-neutral-primary">All insight</h4>
      </div>

      <div class="flex items-center gap-3">
        <CommonButton
          title="Filter"
          type="button"
          bgColor="bg-neutral-surface border border-neutral-line hover:bg-neutral-muted !h-10"
          textColor="text-neutral-secondary button"
          createIcon="filter"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          @click="openFilterMenu"
        />

        <ModalFilterMenu
          ref="filterMenuRef"
          :items="filterMenuItems"
          @reset="resetFilters"
          @apply="applyFilters"
        />
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CommonCards
        :title="revenueCardTitle"
        :value="insights.revenue"
        icon="vendor"
        format="currency"
        currency="EUR"
        :decimals="2"
        iconWrapperClass="bg-brand-purple-background text-brand-purple-foreground"
      />

      <CommonCards
        title="Total Delivered Orders"
        :value="insights.delivered"
        icon="logistics"
        iconWrapperClass="bg-brand-moss-background text-brand-moss-foreground"
      />

      <CommonCards
        title="Total Complaints"
        :value="insights.complaints"
        icon="complaints"
        iconWrapperClass="bg-brand-pink-background text-brand-pink-foreground"
      />
    </section>

    <section v-if="!isAdmin" class="grid grid-cols-1 xl:grid-cols-6 gap-6">
      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6 col-span-4">
        <div class="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h5 class="text-neutral-primary">Revenue Breakdown (€)</h5>
        </div>

        <ChartLine
          v-if="chartDataLine && chartOptionsLine"
          :chartData="chartDataLine"
          :chartOptions="chartOptionsLine"
          :labels="[]"
          :colors="[]"
        />
      </div>

      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6 col-span-2">
        <div class="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h5 class="text-neutral-primary">Top Products</h5>
        </div>

        <ChartDoughnut
          v-if="chartDataTopProducts && chartOptionsTopProducts"
          :chartData="chartDataTopProducts"
          :chartOptions="chartOptionsTopProducts"
          :labels="topProductLabels"
          :colors="topProductColors"
        />
      </div>
    </section>

    <section v-else class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
      <div class="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h5 class="text-neutral-primary">Vendors Revenue Breakdown (€)</h5>
      </div>

      <ChartLine
        v-if="chartDataLine && chartOptionsLine"
        :chartData="chartDataLine"
        :chartOptions="chartOptionsLine"
        :labels="[]"
        :colors="[]"
        heightClass="h-[420px] md:h-[560px]"
      />
    </section>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Joi from 'joi'

import { useUserDetailsStore } from '@/store/userDetailsStore'

definePageMeta({
  layout: 'default',
  customProp: 'Dashboard'
})

useSeoMeta({
  title: 'Dashboard | RexChats'
})

const { showError } = useToastHandler()

const userStore = useUserDetailsStore()
const { user } = storeToRefs(userStore)

const normalizedRole = computed(() => {
  const raw =
    user.value?.role ||
    user.value?.user_role ||
    user.value?.account_type ||
    user.value?.type ||
    ''

  return String(raw).toLowerCase().trim()
})

const isAdmin = computed(() => normalizedRole.value.includes('admin'))

const revenueCardTitle = computed(() =>
  isAdmin.value ? 'Total Revenue' : 'Total Vendor Revenue'
)

const filterMenuRef = ref(null)

const filters = reactive({
  fromDate: null,
  toDate: null
})

const filterMenuItems = [
  {
    label: 'Date From',
    hasDate: true
  },
  {
    label: 'Date To',
    hasDate: true
  }
]

const filterSchema = Joi.object({
  fromDate: Joi.date().allow(null),
  toDate: Joi.date().allow(null)
})
  .custom((value, helpers) => {
    const from = value?.fromDate ? new Date(value.fromDate) : null
    const to = value?.toDate ? new Date(value.toDate) : null

    if ((from && !to) || (!from && to)) {
      return helpers.error('any.custom')
    }

    if (from && to && from.getTime() > to.getTime()) {
      return helpers.error('any.custom')
    }

    return value
  })
  .messages({
    'any.custom': 'Select a valid date range (From and To).'
  })

const openFilterMenu = (event) => {
  filterMenuRef.value?.toggle(event)
}

const insights = reactive({
  revenue: 10456.67,
  delivered: 6900,
  complaints: 19
})

const resetFilters = () => {
  filters.fromDate = null
  filters.toDate = null
  buildCharts()
}

const applyFilters = (selected) => {
  const next = {
    fromDate: (selected && selected[0]) || null,
    toDate: (selected && selected[1]) || null
  }

  const result = filterSchema.validate(next)
  if (result.error) {
    showError(result.error.details[0].message)
    return
  }

  filters.fromDate = next.fromDate
  filters.toDate = next.toDate

  buildCharts()
}

const chartDataLine = ref(null)
const chartOptionsLine = ref(null)

const chartDataTopProducts = ref(null)
const chartOptionsTopProducts = ref(null)


const topProductLabels = ref([
  "T Shoe",
  "Shirt",
  "Belt",
  "Compassion Shirt",
  "Balenciaga Topego",
  "High Fashion"
])

const topProductColors = ref([])

const cssVar = (name, fallback) => {
  if (!process.client) return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name)
  return value ? String(value).trim() || fallback : fallback
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const allMonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
const allRevenueSeries = [200, 192, 210, 515, 545, 565, 620, 740, 890]

const resolveDateRangeSlice = () => {
  if (!filters.fromDate || !filters.toDate) {
    return { labels: allMonthLabels, series: allRevenueSeries }
  }

  const fromMonth = new Date(filters.fromDate).getMonth()
  const toMonth = new Date(filters.toDate).getMonth()
  const start = clamp(fromMonth, 0, allMonthLabels.length - 1)
  const end = clamp(toMonth, 0, allMonthLabels.length - 1)
  const startIndex = Math.min(start, end)
  const endIndex = Math.max(start, end)

  return {
    labels: allMonthLabels.slice(startIndex, endIndex + 1),
    series: allRevenueSeries.slice(startIndex, endIndex + 1)
  }
}

const setChartDataLine = () => {
  const { labels, series } = resolveDateRangeSlice()

  return {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: series,
        borderColor: cssVar("--primary-200", "#753599"),
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  }
}

const setChartOptionsLine = () => {
  const tickColor = cssVar("--neutral-secondary", "#97989A")
  const gridColor = cssVar("--neutral-line", "#E8E9E9")

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => '€' + new Intl.NumberFormat("en-US").format(context.parsed.y)
        }
      }
    },
    scales: {
      x: {
        ticks: { color: tickColor },
        grid: { display: false }
      },
      y: {
        min: 0,
        max: 1000,
        ticks: { color: tickColor, stepSize: 100 },
        grid: { color: gridColor, drawBorder: false }
      }
    }
  }
}

const setChartDataTopProducts = () => {
  const values = [28, 12, 24, 14, 8, 10]

  return {
    labels: topProductLabels.value,
    datasets: [
      {
        data: values,
        backgroundColor: topProductColors.value,
        hoverBackgroundColor: topProductColors.value,
        borderWidth: 6,
        borderRadius: 9
      }
    ]
  }
}

const setChartOptionsTopProducts = () => {
  return {
    cutout: "60%",
    plugins: {
      legend: {
        display: false
      }
    }
  }
}

const buildCharts = () => {
  topProductColors.value = [
    cssVar("--brand-purple-foreground", "#AF52DE"),
    cssVar("--brand-blue-foreground", "#007AFF"),
    cssVar("--brand-magenta-foreground", "#9B5A7B"),
    cssVar("--brand-indigo-foreground", "#5855D6"),
    cssVar("--brand-red-foreground", "#C25745"),
    cssVar("--brand-moss-foreground", "#606C38")
  ]

  chartDataLine.value = setChartDataLine()
  chartOptionsLine.value = setChartOptionsLine()

  if (!isAdmin.value) {
    chartDataTopProducts.value = setChartDataTopProducts()
    chartOptionsTopProducts.value = setChartOptionsTopProducts()
  } else {
    chartDataTopProducts.value = null
    chartOptionsTopProducts.value = null
  }
}

let themeObserver = null

const watchThemeMode = () => {
  if (!process.client) return

  themeObserver = new MutationObserver(() => {
    buildCharts()
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"]
  })
}

onMounted(() => {
  buildCharts()
  watchThemeMode()
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})
</script>



