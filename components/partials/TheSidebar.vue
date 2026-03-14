<template>
  <aside class="h-full w-full bg-neutral-surface border-r border-neutral-line flex flex-col">
    <!-- Top -->
    <div class="h-16 px-6 flex items-center justify-between border-b border-neutral-line">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div v-if="collapsed" class="w-10 overflow-hidden">
          <BaseCustomIcon name="logo-initials" customClass="w-[144px] h-8 text-primary-300" />
        </div>
        <BaseCustomIcon v-else name="logo" customClass="w-[144px] h-8 text-primary-300" />
      </NuxtLink>

      <button
        type="button"
        class="hidden lg:flex items-center justify-center rounded-lg text-neutral-secondary hover:bg-neutral-muted"
        @click="emit('toggle-collapse')"
        aria-label="Toggle sidebar"
      >
        <BaseCustomIcon :name="collapsed ? 'arrow-right' : 'arrow-left'" customClass="" />
      </button>

      <button
        type="button"
        class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-line text-neutral-secondary hover:bg-neutral-muted"
        @click="emit('close-sidebar')"
        aria-label="Close sidebar"
      >
        <i class="pi pi-times" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-4 py-6">
      <div v-for="(group, groupIndex) in navGroups" :key="group.title">
        <p
          v-if="!collapsed"
          class="body-xsmall text-neutral-secondary uppercase tracking-wider px-3 mb-2"
        >
          {{ group.title }}
        </p>

        <ul class="flex flex-col gap-1">
          <li v-for="item in group.items" :key="item.label">
            <NuxtLink
              :to="item.path"
              class="flex items-center rounded-xl transition-colors"
              :class="getNavItemClass(item)"
              @click="emit('close-sidebar')"
            >
              <BaseCustomIcon
                :name="item.icon"
                customClass=""
              />
              <span v-if="!collapsed" class="label font-medium">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>

        <div
          v-if="groupIndex !== navGroups.length - 1"
          class="my-5 border-t border-neutral-line"
        />
      </div>

      <!-- Theme -->
      <div v-if="!collapsed" class="mt-6">
        <div class="flex items-center justify-between px-3">
          <div v-if="!collapsed" class="flex items-center gap-3 text-primary-400">
            <BaseCustomIcon name="theme" customClass="" />
            <span class="text-sm font-medium">Theme</span>
          </div>

          <div
            class="bg-primary-300 rounded-xl p-1 flex items-center gap-1"
            :class="collapsed ? 'w-full justify-center' : ''"
          >
            <button
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center"
              :class="currentTheme === 'light' ? 'bg-neutral-inverted text-primary-300' : 'text-neutral-inverted/90'"
              @click="setTheme('light')"
              aria-label="Light theme"
            >
              <BaseCustomIcon name="sun" customClass="" />
            </button>

            <button
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center"
              :class="currentTheme === 'dark' ? 'bg-neutral-inverted text-primary-300' : 'text-neutral-inverted/90'"
              @click="setTheme('dark')"
              aria-label="Dark theme"
            >
              <BaseCustomIcon name="moon" customClass="" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- User -->
    <div class="px-4 pb-5">
      <div class="border-t border-neutral-line pt-5">
        <div
          v-if="!collapsed"
          class="border border-neutral-line rounded-xl p-1 bg-neutral-background flex items-center gap-3"
        >
          <div class="w-11 h-11 rounded-lg bg-primary-300 text-neutral-inverted flex items-center justify-center font-semibold">
            {{ initials }}
          </div>

          <div class="min-w-0 flex-1">
            <p class="body-label font-medium text-neutral-primary truncate">{{ displayName }}</p>
            <p class="body-xsmall text-neutral-primary truncate">{{ displayEmail }}</p>
          </div>

          <button
            type="button"
            class=" rounded-lg flex items-center justify-center text-primary-400 hover:bg-neutral-muted"
            @click="logoutModal = true"
            aria-label="Logout"
          >
            <BaseCustomIcon name="logout" customClass="" />
          </button>
        </div>

        <div v-else class="flex justify-center">
          <div class="w-14 h-14 rounded-2xl bg-primary-300 text-neutral-inverted flex items-center justify-center font-semibold text-lg">
            {{ initials }}
          </div>
        </div>
      </div>
    </div>

    <ModalConfirmation
      :isOpen="logoutModal"
      title="Log Out"
      confirmationMessage="Are you sure you want to logout?"
      informationText="You will need to login again to continue."
      actionButtonText="Log Out"
      actionButtonClass="bg-danger-300 hover:bg-danger-400"
      :requireReason="false"
      btnIcon=""
      @close="logoutModal = false"
      @confirm="handleLogout"
    />
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useUserDetailsStore } from '@/store/userDetailsStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close-sidebar', 'toggle-collapse'])

const route = useRoute()
const router = useRouter()

const userDetailsStore = useUserDetailsStore()
const { user, token } = storeToRefs(userDetailsStore)

const logoutModal = ref(false)

const navGroups = ref([
  {
    title: 'Overview',
    items: [{ icon: 'dashboard', label: 'Dashboard', path: '/' }]
  },
  {
    title: 'Sales',
    items: [
      { icon: 'orders', label: 'Orders', path: '/orders' },
      { icon: 'conversations', label: 'Conversations', path: '/conversations' },
      { icon: 'complaints', label: 'Complaints', path: '/complaints' }
    ]
  },
  {
    title: 'Catalog',
    items: [
      { icon: 'products', label: 'Products', path: '/products' },
      { icon: 'inventory', label: 'Inventory', path: '/inventory' }
    ]
  },
  {
    title: 'Fulfilment',
    items: [{ icon: 'logistics', label: 'Logistics', path: '/logistics' }]
  },
  {
    title: 'Configuration',
    items: [
      { icon: 'vendor', label: 'Vendor Management', path: '/vendor-management' },
      { icon: 'settings', label: 'Settings', path: '/settings' }
    ]
  }
])

const isActiveRoute = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const getNavItemClass = (item) => {
  const active = isActiveRoute(item.path)

  return [
    props.collapsed ? 'justify-center px-0 h-11' : 'gap-3 px-3 h-11',
    active
      ? 'bg-primary-300 text-neutral-inverted'
      : 'text-primary-400 hover:bg-neutral-muted'
  ].join(' ')
}

const displayName = computed(() => {
  return user.value?.name || user.value?.full_name || 'Jane Doe'
})

const displayEmail = computed(() => {
  return user.value?.email || 'janedoe@mail.com'
})

const initials = computed(() => {
  const source = displayName.value || 'JD'
  const parts = source.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('') || 'JD'
})

const currentTheme = ref('light')

const setTheme = (theme) => {
  currentTheme.value = theme

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('color-theme', 'dark')
    return
  }

  document.documentElement.classList.remove('dark')
  localStorage.setItem('color-theme', 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('color-theme')

  if (savedTheme) {
    currentTheme.value = savedTheme

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    return
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setTheme(prefersDark ? 'dark' : 'light')
})

const handleLogout = () => {
  token.value = ''
  user.value = {}

  if (process.client) {
    const theme = localStorage.getItem('color-theme')
    localStorage.clear()
    if (theme) localStorage.setItem('color-theme', theme)
  }

  logoutModal.value = false
  router.push('/login')
}
</script>

