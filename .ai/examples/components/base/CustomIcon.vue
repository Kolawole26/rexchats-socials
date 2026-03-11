<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    class="svg-icon"
    :class="customClass"
  />
</template>

<script setup>
import { shallowRef, watch, onMounted } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  customClass: {
    type: [String, Array, Object],
    default: ''
  }
})

const iconComponent = shallowRef(null)

/**
 * Dynamically imports an SVG icon as a Vue component.
 * Icons should be stored in ~/assets/icons/
 */
const loadIcon = async (name) => {
  if (!name) return
  try {
    const module = await import(`~/assets/icons/${name}.svg?component`)
    iconComponent.value = module.default
  } catch (error) {
    console.warn(`[BaseIcon] Icon "${name}" not found in ~/assets/icons`)
    iconComponent.value = null
  }
}

onMounted(() => loadIcon(props.name))

watch(
  () => props.name,
  (newName) => loadIcon(newName)
)
</script>