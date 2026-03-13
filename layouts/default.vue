<template>
  <div class="min-h-screen flex bg-neutral-20 text-neutral-500 overflow-hidden">
    <!-- Sidebar -->
    <div
      id="app-sidebar"
      class="w-[18rem] bg-neutral-10 dark:bg-neutral-10 fixed lg:fixed top-0 left-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out"
      :class="{
        'translate-x-0 overflow-y-auto': isSidebarOpen,
        '-translate-x-full lg:translate-x-0 overflow-y-auto': !isSidebarOpen
      }"
    >
      <div class="">
        <PartialsTheSidebar @close-sidebar="isSidebarOpen = false" />
      </div>
    </div>

        <!-- Mobile Overlay -->
        <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-neutral-500 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main Content Area -->
    <div class="min-h-screen flex flex-col flex-auto relative lg:ml-[18rem]">
      <!-- Header -->
      <PartialsTheHeader
      :customProp="customProp"
        :prevNavProp="prevNavProp"
        :prevNavLink="prevNavLink"
        :currentPrevProp="currentPrevProp"
        :currentPrevLink="currentPrevLink"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Page Content -->
      <div class="py-4 sm:px-4 flex flex-col flex-auto text-neutral-500">
        <h4 class="font-semibold text-base ml-6 capitalize mb-2 lg:hidden">
          <NuxtLink
            :to="prevNavLink ? `/${prevNavLink}` : `/${prevNavProp}`"
            v-if="prevNavProp"
            class="text-neutral-200"
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
import { ref, watch } from "vue";
import { useRoute } from "vue-router";


const route = useRoute();
const isSidebarOpen = ref(false);

// Props from route meta
const customProp = ref(route.meta.customProp);
const prevNavProp = ref(route.meta.prevNavProp);
const prevNavLink = ref(route.meta.prevNavLink);
const currentPrevProp = ref(route.meta.currentPrevProp);
const currentPrevLink = ref(route.meta.currentPrevLink);

// Watch for changes in route meta properties
watch(
  () => route.meta.customProp,
  (newValue) => {
    customProp.value = newValue;
  }
);
watch(
  () => route.meta.prevNavProp,
  (newValue) => {
    prevNavProp.value = newValue;
  }
);
watch(
  () => route.meta.prevNavLink,
  (newValue) => {
    prevNavLink.value = newValue;
  }
);
watch(
  () => route.meta.currentPrevProp,
  (newValue) => {
    currentPrevProp.value = newValue;
  }
);
watch(
  () => route.meta.currentPrevLink,
  (newValue) => {
    currentPrevLink.value = newValue;
  }
);

// Toggle Sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>
