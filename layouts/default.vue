<template>
  <div class="min-h-screen flex bg-neutral-background text-neutral-primary overflow-hidden">
    <!-- Sidebar -->
    <div
      id="app-sidebar"
      class="fixed top-0 left-0 h-full z-50 lg:z-auto bg-neutral-surface transition-all duration-300 ease-in-out"
      :class="sidebarContainerClass"
    >
      <PartialsTheSidebar
        :collapsed="isSidebarCollapsed"
        @close-sidebar="isSidebarOpen = false"
        @toggle-collapse="toggleCollapse"
      />
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-neutral-primary/40 z-40 lg:hidden transition-opacity duration-300"
      @click="isSidebarOpen = false"
    />

    <!-- Main Content Area -->
    <div
      class="min-h-screen flex flex-col flex-auto relative transition-all duration-300"
      :class="contentOffsetClass"
    >
      <PartialsTheHeader
        :customProp="customProp"
        :prevNavProp="prevNavProp"
        :prevNavLink="prevNavLink"
        :currentPrevProp="currentPrevProp"
        :currentPrevLink="currentPrevLink"
        @toggle-sidebar="toggleSidebar"
      />

      <div class="py-4 sm:px-6 flex flex-col flex-auto">
        <h4 class="font-semibold text-base ml-1 capitalize mb-2 lg:hidden">
          <NuxtLink
            v-if="prevNavProp"
            :to="prevNavLink ? '/' + prevNavLink : '/' + prevNavProp"
            class="text-neutral-secondary"
          >
            {{ prevNavProp }} /
          </NuxtLink>
          {{ customProp }}
        </h4>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)

onMounted(() => {
  if (!process.client) return
  const saved = localStorage.getItem('sidebar-collapsed')
  isSidebarCollapsed.value = saved === 'true'
})

const sidebarContainerClass = computed(() => {
  const widthClass = isSidebarCollapsed.value ? 'lg:w-20' : 'lg:w-72'
  const mobileWidth = 'w-72'

  return [
    'border-r border-neutral-line',
    mobileWidth,
    widthClass,
    isSidebarOpen.value ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ].join(' ')
})

const contentOffsetClass = computed(() => {
  return isSidebarCollapsed.value ? 'lg:ml-20' : 'lg:ml-72'
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  if (process.client) {
    localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed.value))
  }
}

const customProp = ref(route.meta.customProp || '')
const prevNavProp = ref(route.meta.prevNavProp || '')
const prevNavLink = ref(route.meta.prevNavLink || '')
const currentPrevProp = ref(route.meta.currentPrevProp || '')
const currentPrevLink = ref(route.meta.currentPrevLink || '')

watch(
  () => route.meta.customProp,
  (newValue) => {
    customProp.value = newValue || ''
  }
)
watch(
  () => route.meta.prevNavProp,
  (newValue) => {
    prevNavProp.value = newValue || ''
  }
)
watch(
  () => route.meta.prevNavLink,
  (newValue) => {
    prevNavLink.value = newValue || ''
  }
)
watch(
  () => route.meta.currentPrevProp,
  (newValue) => {
    currentPrevProp.value = newValue || ''
  }
)
watch(
  () => route.meta.currentPrevLink,
  (newValue) => {
    currentPrevLink.value = newValue || ''
  }
)
</script>
