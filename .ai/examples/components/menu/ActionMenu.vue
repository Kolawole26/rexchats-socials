<template>
  <div class="card flex justify-end" v-if="items && items.length > 0">
    <button @click="toggle" class="dark:text-[white] p-3">
      <BaseCustomIcon name="3dot" />
    </button>
    <Menu ref="menu" :model="items" :popup="true" class="rounded-[8px] !min-w-[143px]">
      <template #item="{ item }">
        <button class="flex items-center justify-between gap-2 py-2 px-3 w-full" @click="$emit(item.emit, data)">                
          <span class="font-normal text-neutral-500 body-small text-nowrap">{{ item.label }}</span>
          <div class="text-neutral-l-600">
            <BaseCustomIcon :name="item.icon"/>
          </div>
        </button>
      </template>
    </Menu>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const menu = ref()
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  data: {
    type: Object,
    default: () => null
  }
})

const toggle = (event) => {
  menu.value.toggle(event)
}
</script>
