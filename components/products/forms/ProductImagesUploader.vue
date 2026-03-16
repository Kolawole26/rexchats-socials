<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <p class="label text-neutral-primary">Product Images</p>
      <p class="body-xsmall text-neutral-secondary">Jpg, png max 5mb each</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div v-for="(img, index) in slots" :key="index" class="relative">
        <input
          :ref="(el) => setInputRef(el, index)"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange($event, index)"
        />

        <div
          class="border border-dashed border-primary-100 rounded-2xl bg-neutral-surface overflow-hidden h-[110px] flex items-center justify-center cursor-pointer hover:bg-neutral-muted transition"
          role="button"
          tabindex="0"
          @click="openFile(index)"
          @keydown.enter.prevent="openFile(index)"
          @keydown.space.prevent="openFile(index)"
        >
          <img v-if="img" :src="img" alt="Product image" class="w-full h-full object-cover" />

          <div v-else class="flex flex-col items-center gap-1 text-center">
            <BaseCustomIcon name="products" customClass="w-6 h-6 text-primary-300" />
            <p class="body-xsmall text-primary-300">Add Image</p>
            <p class="body-xsmall text-neutral-secondary">Drag or Drop</p>
          </div>
        </div>

        <div v-if="img" class="absolute top-2 right-2">
          <CommonButton
            aria-label="Remove image"
            type="button"
            title=""
            bgColor="bg-neutral-surface hover:bg-neutral-muted !h-9 !w-9 !px-0 border border-neutral-line"
            textColor="text-danger-300"
            createIcon="trash"
            @click.prevent.stop="removeImage(index)"
          />
        </div>
      </div>
    </div>

    <p v-if="error" class="text-danger-300 body-xsmall mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'input'])

const fileInputs = ref([])

const slots = computed(() => {
  const value = Array.isArray(props.modelValue) ? props.modelValue : []
  const next = value.slice(0, 4)
  while (next.length < 4) next.push(null)
  return next
})

const setInputRef = (el, index) => {
  if (!el) return
  fileInputs.value[index] = el
}

const openFile = (index) => {
  const input = fileInputs.value[index]
  if (input && typeof input.click === 'function') input.click()
}

const onFileChange = (event, index) => {
  const file = event && event.target && event.target.files ? event.target.files[0] : null
  if (!file) return

  const url = URL.createObjectURL(file)
  const next = slots.value.slice(0)
  next[index] = url

  emit('update:modelValue', next)
  emit('input', next)
}

const removeImage = (index) => {
  const next = slots.value.slice(0)
  next[index] = null

  emit('update:modelValue', next)
  emit('input', next)
}
</script>
