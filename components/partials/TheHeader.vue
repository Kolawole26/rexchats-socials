<template>
  <header class="h-[72px] bg-neutral-surface border-b border-neutral-line px-6 flex items-center justify-between">
    <!-- Left -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        type="button"
        class="lg:hidden w-10 h-10 rounded-lg border border-neutral-line flex items-center justify-center text-neutral-secondary hover:bg-neutral-muted"
        @click="emit('toggle-sidebar')"
        aria-label="Open sidebar"
      >
        <i class="pi pi-bars" />
      </button>



      <h5 class="text-neutral-primary h5 truncate">
        {{ pageTitle }}
      </h5>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="p-3 rounded-lg bg-primary-50 flex items-center justify-center text-primary-400 hover:bg-neutral-muted"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-controls="notifications_panel"
        @click="toggleNotifications"
      >
        <BaseCustomIcon name="bell" customClass="" />
      </button>

      <OverlayPanel ref="notificationsRef" id="notifications_panel" :popup="true" class="w-[360px] rounded-2xl">
        <div class="flex items-center px-4 py-3 bg-neutral-surface border-b border-neutral-100">
          <CommonButton
            aria-label="Close"
            type="button"
            title=""
            bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
            textColor="text-neutral-primary"
            createIcon="cancel-red"
            @click="toggleNotifications"
          />
          <p class="mx-auto button text-neutral-primary">Notifications</p>
          <CommonButton
            v-if="notifications.length"
            aria-label="Clear notifications"
            type="button"
            title=""
            bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
            textColor="text-danger-300"
            createIcon="trash"
            @click="clearNotifications"
          />
          <div v-else class="w-10" aria-hidden="true" />
        </div>

        <div class="max-h-[520px] overflow-auto">
          <div v-if="!notifications.length" class="p-6">
            <p class="body-small text-neutral-secondary">No notifications yet.</p>
          </div>

          <button
            v-for="n in notifications"
            :key="n.id"
            type="button"
            class="w-full text-left flex items-start gap-3 px-4 py-4 border-b border-neutral-100 hover:bg-neutral-muted"
            @click="markAsRead(n.id)"
          >
            <div class="w-9 h-9 rounded-xl bg-neutral-background border border-neutral-line flex items-center justify-center text-primary-400">
              <BaseCustomIcon :name="n.icon" customClass="" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="body-small text-neutral-primary">{{ n.message }}</p>
              <p class="body-xsmall text-neutral-secondary">{{ n.time }}</p>
            </div>

            <span v-if="n.unread" class="w-2 h-2 rounded-full bg-danger-300 mt-2" aria-hidden="true" />
          </button>
        </div>
      </OverlayPanel>

      <button
        type="button"
        class="flex items-center gap-3"
        aria-haspopup="true"
        aria-controls="user_menu"
        @click="toggleMenu"
      >
        <div class="w-10 h-10 rounded-lg bg-primary-300 text-neutral-inverted flex items-center justify-center font-semibold">
          {{ initials }}
        </div>
        <div class="hidden md:flex items-center gap-2">
          <p class="body-regular text-neutral-primary">{{ displayName }}</p>
          <BaseCustomIcon
            name="chevron-down"
            customClass="text-neutral-secondary"
            :class="menuOpen ? 'rotate-180' : ''"
          />
        </div>
      </button>

      <Menu ref="menuRef" id="user_menu" :popup="true" :model="menuItems">
        <template #item="{ item, props }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a
              v-ripple
              :href="href"
              v-bind="props.action"
              class="flex items-center justify-between"
              @click="(navigate(), (menuOpen = false))"
            >
              <div class="w-4 text-primary-400">
                <BaseCustomIcon :name="item.icon" />
              </div>
              <span class="ml-2 body-xsmall">{{ item.label }}</span>
            </a>
          </router-link>

          <a
            v-else
            v-ripple
            href="#"
            v-bind="props.action"
            class="flex items-center justify-between"
            @click.prevent="onMenuCommand(item)"
          >
            <span class="ml-2 body-xsmall">{{ item.label }}</span>
            <div class="w-4 text-danger-300">
              <BaseCustomIcon :name="item.icon" />
            </div>
          </a>
        </template>
      </Menu>

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
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useUserDetailsStore } from '@/store/userDetailsStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  customProp: {
    type: String,
    default: ''
  },
  prevNavProp: {
    type: String,
    default: ''
  },
  prevNavLink: {
    type: String,
    default: ''
  },
  currentPrevProp: {
    type: String,
    default: ''
  },
  currentPrevLink: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()

const userDetailsStore = useUserDetailsStore()
const { user, token } = storeToRefs(userDetailsStore)

const menuRef = ref()
const menuOpen = ref(false)
const logoutModal = ref(false)
const notificationsRef = ref(null)

const notifications = ref([
  {
    id: 'n-1',
    icon: 'logistics',
    message: 'Shipment created for order #123456.',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'n-2',
    icon: 'inventory',
    message: '#123456 is running low on stock.',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'n-3',
    icon: 'logistics',
    message: 'Shipment created for order #{order_id}.',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'n-4',
    icon: 'complaints',
    message: 'A customer complaint was detected.',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'n-5',
    icon: 'logistics',
    message: 'Shipment created for order #{order_id}.',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'n-6',
    icon: 'logistics',
    message: 'Shipment created for order #{order_id}.',
    time: '2 mins ago',
    unread: true
  }
])

const toggleNotifications = (event) => {
  notificationsRef.value?.toggle(event)
}

const clearNotifications = () => {
  notifications.value = []
  notificationsRef.value?.hide()
}

const markAsRead = (id) => {
  notifications.value = notifications.value.map((n) =>
    n.id === id ? { ...n, unread: false } : n
  )
}

const displayName = computed(() => {
  return user.value?.name || user.value?.full_name || 'Jane Doe'
})

const initials = computed(() => {
  const source = displayName.value || 'JD'
  const parts = source.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('') || 'JD'
})

const pageTitle = computed(() => {
  return props.customProp || (route.meta?.customProp ? String(route.meta.customProp) : '') || 'Dashboard'
})

const showBack = computed(() => {
  return Boolean(props.prevNavProp || props.currentPrevProp)
})

const menuItems = ref([
  {
    label: 'Profile Information',
    icon: 'users',
    route: '/profile'
  },
  {
    label: 'Sign Out',
    icon: 'logout',
    command: () => {
      logoutModal.value = true
    }
  }
])

const toggleMenu = (event) => {
  menuOpen.value = !menuOpen.value
  menuRef.value.toggle(event)
}

const onMenuCommand = (item) => {
  if (item && item.command) item.command()
  menuOpen.value = false
}

const goBack = () => {
  router.back()
}

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

<style>
.p-menu {
  @apply !min-w-[160px];
}
</style>
