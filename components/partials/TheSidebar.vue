<template>
  <div class="flex h-screen bg-primary-300 dark:bg-primary-600">
    <!-- Sidebar -->
    <div
      class="w-[18rem] border-r border-neutral-100 fixed h-full flex flex-col text-neutral-10 dark:text-neutral-500 label bg-primary-300 dark:bg-primary-600 overflow-y-scroll lg:overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out overflow-x-hidden"
    >
      <!-- Cancel Icon (Only for Mobile) -->
      <button class="absolute top-7 right-4 lg:hidden" @click="emit('close-sidebar')">
        <i
          class="pi pi-times text-neutral-10 text-base border border-neutral-10 p-1 rounded-full"
        ></i>
      </button>
      <!-- Sidebar Content -->
      <a class="inline-flex items-center gap-3 px-8 py-4 cursor-pointer">
        <BaseCustomIcon name="logo" />
      </a>
      <div class="w-[calc(100%-3rem)] mx-auto h-[1px] px-6" />
      <div class="px-6 pt-6 flex-1">
        <ul ref="outerDiv" class="flex flex-col gap-2 overflow-hidden">
          <template v-for="(item, index) of navs" :key="index">
            <li>
              <NuxtLink
                :to="item.path"
                :class="
                  selectedNav === item.label || route.path === item.path
                    ? 'bg-neutral-10 dark:bg-primary-300 text-primary-300 dark:text-neutral-500 border-l-[5px] border-secondary-300  shadow-sm'
                    : 'border-transparent hover:bg-primary-500 dark:hover:bg-primary-300'
                "
                class="z-30 relative flex items-center gap-2 px-3 py-[10px] rounded-lg cursor-pointer transition-all"
                @click="selectedNav = item.label; item?.subMenu ? '' : emit('close-sidebar')"
              >
                <BaseCustomIcon :name="item.icon" />
                <span class="flex-1 font-semibold text-sm">{{ item.label }}</span>
                <i v-if="item?.subMenu" class="pi pi-chevron-down text-sm leading-none" />
              </NuxtLink>
              <div
                v-if="selectedNav === item.label && item?.subMenu"
                class="relative pl-1.5 flex flex-col transition-all duration-500 mt-2"
                :class="selectedNav === item.label && item?.subMenu ? 'opacity-100' : 'opacity-0'"
              >
                <template v-for="(subItem, index) of item.subMenu" :key="index">
                  <div
                    class="cursor-pointer relative px-3.5 py-2 flex items-center transition-all"
                    @click="selectedSubNav = subItem.label"
                  >
                    <svg
                      width="18"
                      height="44"
                      viewBox="0 0 18 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="absolute left-4 -top-2"
                    >
                      <path
                        :d="getLinePath(index, item.subMenu.length)"
                        class="stroke-primary-100"
                        stroke-width="1"
                      />
                      <path
                        d="M11.136 26.2862L11.1313 26.2863C11.1243 26.2863 11.1174 26.2849 11.1109 26.2823C11.1045 26.2796 11.0986 26.2756 11.0937 26.2707L11.0937 26.2707L11.0917 26.2687C11.0805 26.2575 11.0742 26.2422 11.0742 26.2263C11.0742 26.2105 11.0805 26.1953 11.0917 26.1841C11.0917 26.184 11.0917 26.184 11.0917 26.184L14.4286 22.8471L14.7822 22.4936L14.4286 22.14L11.1009 18.8123C11.0922 18.8014 11.0875 18.7878 11.0877 18.7737C11.088 18.7582 11.0943 18.7434 11.1052 18.7324C11.1162 18.7214 11.131 18.7151 11.1466 18.7149C11.1606 18.7146 11.1743 18.7193 11.1852 18.7281L14.9083 22.4512C14.9195 22.4625 14.9258 22.4777 14.9258 22.4936C14.9258 22.5095 14.9195 22.5247 14.9083 22.5359L11.1758 26.2685L11.1758 26.2685L11.1736 26.2707C11.1687 26.2756 11.1628 26.2796 11.1564 26.2823C11.1499 26.2849 11.143 26.2863 11.136 26.2862Z"
                        class="stroke-primary-100 fill-primary-100"
                      />
                      <path
                        d="M1 14V17.5C1 20.2614 3.23858 22.5 6 22.5H15"
                        class="stroke-primary-100"
                        stroke-width="1"
                      />
                      <template v-if="index === getSelectedIndex()">
                        <path
                          d="M11.136 26.2862L11.1313 26.2863C11.1243 26.2863 11.1174 26.2849 11.1109 26.2823C11.1045 26.2796 11.0986 26.2756 11.0937 26.2707L11.0937 26.2707L11.0917 26.2687C11.0805 26.2575 11.0742 26.2422 11.0742 26.2263C11.0742 26.2105 11.0805 26.1953 11.0917 26.1841C11.0917 26.184 11.0917 26.184 11.0917 26.184L14.4286 22.8471L14.7822 22.4936L14.4286 22.14L11.1009 18.8123C11.0922 18.8014 11.0875 18.7878 11.0877 18.7737C11.088 18.7582 11.0943 18.7434 11.1052 18.7324C11.1162 18.7214 11.131 18.7151 11.1466 18.7149C11.1606 18.7146 11.1743 18.7193 11.1852 18.7281L14.9083 22.4512C14.9195 22.4625 14.9258 22.4777 14.9258 22.4936C14.9258 22.5095 14.9195 22.5247 14.9083 22.5359L11.1758 26.2685L11.1758 26.2685L11.1736 26.2707C11.1687 26.2756 11.1628 26.2796 11.1564 26.2823C11.1499 26.2849 11.143 26.2863 11.136 26.2862Z"
                          class="stroke-neutral-10 dark:stroke-neutral-500 fill-neutral-10"
                        />
                        <path
                          d="M1 14V17.5C1 20.2614 3.23858 22.5 6 22.5H15"
                          class="stroke-neutral-10 dark:stroke-neutral-500"
                          stroke-width="1"
                        />
                      </template>
                      <path
                        v-if="index <= getSelectedIndex()"
                        :d="getActiveLinePath(index, getSelectedIndex())"
                        class="stroke-neutral-10 dark:stroke-neutral-500"
                        stroke-width="1"
                      />
                    </svg>
                    <NuxtLink
                      :to="subItem.path"
                      class="leading-relaxed body-xsmall transition-all ml-8"
                      :class="
                        selectedSubNav === subItem.label || route.path === subItem.path
                          ? 'text-neutral-10 dark:text-neutral-500'
                          : 'text-primary-100 dark:text-primary-200 hover:text-primary-200'
                      "
                      @click="emit('close-sidebar')"
                    >
                      {{ subItem.label }}
                    </NuxtLink>
                  </div>
                </template>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <ul class="flex flex-col gap-2 px-6 py-3">
        <template v-for="(item, index) of bottomNavs" :key="index">
          <li
            :class="
              selectedNav === item.label || route.path === item.path
                ? 'bg-primary-200 text-surface-900 shadow-sm'
                : 'border-transparent hover:bg-primary-75 text-surface-600'
            "
            class="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
            @click="selectedNav = item.label"
          >
            <BaseCustomIcon :name="item.icon" />
            <span class="flex-1 font-medium">{{ item.label }}</span>
            <i v-if="item?.subMenu" class="pi pi-chevron-down text-sm leading-none" />
          </li>
        </template>
      </ul>
      <div class="bg-primary-300 dark:bg-primary-600">
        <div class="px-[35px] p-3 flex items-center justify-between switch pb-3">
          <p class="label">Theme</p>
          <div class="flex items-center bg-primary-500 p-[4px] rounded-md">
            <button
              @click="setTheme('light')"
              :class="[
                'p-[5.5px] flex items-center justify-center rounded transition',
                currentTheme  === 'light' ? 'bg-white text-primary-300' : 'text-primary-100'
              ]"
            >
              <i class="pi pi-sun text-sm"></i>
            </button>
            <button
              @click="setTheme('dark')"
              :class="[
                'p-[5.5px] flex items-center justify-center rounded transition',
                currentTheme  === 'dark' ? 'bg-white text-primary-300' : 'text-primary-100'
              ]"
            >
              <i class="pi pi-moon text-sm"></i>
            </button>
          </div>
        </div>
        <div class="w-[calc(100%-3rem)] mx-auto h-[1px] px-6 border-t border-primary-200" />
        <div class="px-4 py-4 cursor-pointer bg-primary-300 dark:bg-primary-600" @click="showModal = true">
          <li
            class="flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-all border-transparent hover:bg-primary-75 text-surface-600"
          >
            <div class="bg-secondary-75 p-[10px] rounded-full text-neutral-500 dark:text-neutral-10">
              <BaseCustomIcon name="users" />
            </div>
            <span class="flex-1 body-regular">Micheal Davidson</span>
            <BaseCustomIcon name="logout" />
          </li>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1" />
    <ModalConfirmation
      :isOpen="showModal"
      title="Log Out"
      confirmationMessage="Are you sure you want to logout?"
      :informationText="customInfo"
      actionButtonText="Log Out"
      :actionButtonClass="modalActionClass"
      :requireReason="false"
      btnIcon=""
      @close="showModal = false"
      @confirm="handlePrimaryAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useUserDetailsStore } from "@/store/userDetailsStore";
import { storeToRefs } from "pinia";

const userDetailsStore = useUserDetailsStore();
const { user, token } = storeToRefs(userDetailsStore);
const route = useRoute()
const router = useRouter()
const selectedNav = ref('')
const selectedSubNav = ref(null)
const bottomNavs = ref([])
const navs = ref([
  {
    icon: 'dashboard',
    label: 'Dashboard',
    path: '/'
  },
  {
    icon: 'users',
    label: 'Users',
    path: '/users'
  },
  {
    icon: 'vendors',
    label: 'Vendors',
    subMenu: [
      {
        label: 'Approved Vendors',
        path: '/vendors'
      },
      {
        label: 'Pending Vendors',
        path: '/vendors/pending'
      }
    ]
  },
  {
    icon: 'estimates',
    label: 'Estimates',
    path: '/estimates'
  },
  {
    icon: 'revenue',
    label: 'Revenue & Payments',
    path: '/revenue-payments'
  },
  {
    icon: 'subscriptions',
    label: 'Subscriptions',
    path: '/subscriptions'
  },
  {
    icon: 'banner',
    label: 'Ad Banner',
    path: '/ad-banner'
  },
  {
    icon: 'notifications',
    label: 'Notifications',
    path: '/notifications'
  },
  {
    icon: 'teams',
    label: 'Teams',
    subMenu: [
      {
        label: 'Team Members',
        path: '/teams'
      },
      {
        label: 'Audit',
        path: '/teams/audit'
      }
    ]
  }
])

const emit = defineEmits(['close-sidebar'])

const getLinePath = (index, totalItems) => {
  if (index === 0) {
    return `M1 0 V40`
  } else if (index === totalItems - 1) {
    return `M1 -4 V14`
  } else {
    return `M1 -4 V40`
  }
}

const getActiveLinePath = (index, selectedIndex) => {
  if (index === 0) {
    return `M1 0 V${index === selectedIndex ? '14' : '40'}`
  } else if (index === selectedIndex) {
    return `M1 -4 V14`
  } else {
    return `M1 -4 V40`
  }
}

const getSelectedIndex = () => {
  // Check if navs exists
  if (!navs.value) {
    return -1
  }

  // Check index 2
  if (navs.value.length > 2 && navs.value[2].subMenu && Array.isArray(navs.value[2].subMenu)) {
    const index = navs.value[2].subMenu.findIndex(
      (subItem) => subItem.label === selectedSubNav.value || route.path === subItem.path
    )
    if (index !== -1) {
      return index
    }
  }

  // Check index 8
  if (navs.value.length > 8 && navs.value[8].subMenu && Array.isArray(navs.value[8].subMenu)) {
    const index = navs.value[8].subMenu.findIndex(
      (subItem) => subItem.label === selectedSubNav.value || route.path === subItem.path
    )
    if (index !== -1) {
      return index
    }
  }

  // Return -1 if not found in either location
  return -1
}

const showModal = ref(false)

const handlePrimaryAction = () => {
  token.value = "";
  user.value = {};
  const theme = localStorage.getItem("color-theme"); // Save theme
  localStorage.clear(); // Clear everything
  if (theme) {
    localStorage.setItem("color-theme", theme); // Restore theme
  }
  router.push("/login");
};

const handleBack = () => {
  console.log('Back button clicked')
}

const checked = ref(false)


const currentTheme = ref("");

const setTheme = (theme) => {
  currentTheme.value = theme;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("color-theme");
  if (savedTheme) {
    currentTheme.value = savedTheme;
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } else {
    // Use system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = prefersDark ? "dark" : "light";
    setTheme(systemTheme);
  }
});
</script>
