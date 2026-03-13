<template>
  <div class="">
    <!-- Header -->
    <div
      class="h-[70px] flex justify-between items-center px-8 bg-neutral-10 border-b border-neutral-100 dark:bg-neutral-10 relative lg:static"
    >
      <!-- Sidebar Toggle Button (Mobile) -->
      <a
        class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100 mr-4 mt-1"
        @click="toggleSidebar"
      >
        <i class="pi pi-bars text-2xl" />
      </a>

      <!-- Notification and User Greeting (Mobile) -->
      <button
        class="flex items-center ml-auto mr-2 lg:hidden"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        @click="toggle"
      >
        <div class="bg-secondary-75 p-[10px] rounded-full text-neutral-500 dark:text-neutral-10 mr-2">
          <BaseCustomIcon name="users" />
        </div>
        <p class="mr-2 text-base font-normal text-neutral-500">
          <span class="text-neutral-500 body-regular">Micheal Davidson</span>
        </p>
        <i
          class="pi pi-chevron-down text-sm leading-none"
          :class="onBtnDirection ? 'rotate-[180deg]' : ''"
        />
      </button>

      <!-- Navigation Breadcrumbs and User Menu (Desktop) -->
      <ul
        class="list-none p-0 m-0 hidden lg:flex lg:items-center select-none lg:flex-row w-auto lg:w-full border lg:border-0 border-surface bg-surface-0 dark:bg-surface-950 right-0 top-full z-10 shadow lg:shadow-none absolute lg:static"
      >
        <!-- Breadcrumbs -->
        <h4 class="text-base font-semibold ml-3 capitalize">
          <NuxtLink
            v-if="prevNavProp"
            :to="prevNavLink ? `/${prevNavLink}` : `/${prevNavProp}`"
            class="text-neutral-200"
          >
            {{ prevNavProp }} 
            <i class="pi pi-chevron-right text-xs text-neutral-200 leading-none px-2" />
          </NuxtLink>
          <NuxtLink
            v-if="currentPrevProp"
            :to="currentPrevLink ? `/${currentPrevLink}` : `/${currentPrevProp}`"
            class="text-neutral-200"
          >
            {{ currentPrevProp }} 
            <i class="pi pi-chevron-right text-xs text-neutral-200 leading-none px-2" />
          </NuxtLink>

          {{ customProp }}
        </h4>
        <!-- User Dropdown -->

        <button
          class="flex items-center ml-auto mr-2"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          @click="toggle"
        >
          <div class="bg-secondary-75 p-[10px] rounded-full text-neutral-500 dark:text-neutral-10 mr-2">
            <BaseCustomIcon name="users" />
          </div>
          <p class="mr-2 text-base font-normal text-neutral-500">
            <span class="text-neutral-500 body-regular">Micheal Davidson</span>
          </p>
          <i
            class="pi pi-chevron-down text-sm leading-none"
            :class="onBtnDirection ? 'rotate-[180deg]' : ''"
          />
        </button>
        <!-- Dropdown Menu -->
        <Menu ref="op" id="overlay_menu" :popup="true" :model="items">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a
                v-ripple
                :href="href"
                v-bind="props.action"
                @click="(navigate, (onBtnDirection = false))"
                class=" flex items-center justify-between"
              >
                <span class="ml-2 body-xsmall">{{ item.label }}</span>
                <div class=" text-neutral-200 w-4">
                  <BaseCustomIcon :name="item.icon" />
                </div>
              </a>
            </router-link>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action" class="flex items-center justify-between">
              <span class="ml-2 body-xsmall">{{ item.label }}</span>
              <div class=" text-danger-300 w-4">
                <BaseCustomIcon :name="item.icon" />
              </div>
            </a>
          </template>
        </Menu>
      </ul>
    </div>

    <!-- Logout Confirmation Modal -->
    <ModalConfirmation
      :isOpen="logoutModal"
      title="Log Out"
      confirmationMessage="Are you sure you want to logout?"
       :informationText="customInfo"
      actionButtonText="Log Out"
      :actionButtonClass="modalActionClass"
      :requireReason="false"
      btnIcon=""
      @close="logoutModal = false"
      @confirm="handlePrimaryAction"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserDetailsStore } from "@/store/userDetailsStore";
import { useRoute, useRouter } from '#vue-router'

const userDetailsStore = useUserDetailsStore();
const { user, token } = storeToRefs(userDetailsStore);
// Props
const props = defineProps({
  customProp: {
    type: String,
    required: true
  },
  prevNavProp: {
    type: String
  },
  prevNavLink: {
    type: String
  },
  currentPrevProp: {
    type: String
  },
  currentPrevLink: {
    type: String
  }
})

console.log(props)

// Dropdown Menu Items
const items = ref([
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

const router = useRouter()
// Refs
const op = ref()
const logoutModal = ref(false)
const onBtnDirection = ref(false)
const viewNotification = ref(false)

// Emit event to toggle sidebar
const emit = defineEmits(['toggle-sidebar'])

// Toggle Dropdown Menu
const toggle = (event) => {
  onBtnDirection.value = !onBtnDirection.value
  op.value.toggle(event)
}

// Toggle Sidebar
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// Handle Logout Action
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
</script>

<style>
.p-menu {
  @apply !min-w-[143px]
}
</style>
