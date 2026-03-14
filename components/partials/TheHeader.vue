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
        class=" p-3 rounded-lg bg-primary-50 flex items-center justify-center text-primary-400 hover:bg-neutral-muted"
        aria-label="Notifications"
      >
        <BaseCustomIcon name="bell" customClass="" />
      </button>

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
              <span class="ml-2 body-xsmall">{{ item.label }}</span>
              <div class="w-4 text-primary-400">
                <BaseCustomIcon :name="item.icon" />
              </div>
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
    label: 'Profile',
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
