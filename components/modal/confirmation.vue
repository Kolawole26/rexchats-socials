<template>
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :show-header="false"
      class="w-full max-w-md rounded-lg p-0 custom-modal"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 bg-neutral-20">
        <div class="flex items-center gap-3">
          <div v-if="icon" class="">
            <BaseCustomIcon :name="icon" />
          </div>
          <p class="text-neutral-500 body-regular">{{ title }}</p>
        </div>
        <button @click="close">
          <i
            class="pi pi-times text-neutral-500 text-base hover:bg-primary-50 p-3 hover:rounded-full"
          />
        </button>
      </div>
  
      <!-- Modal Body -->
      <div class="px-6 py-6">
        <div class=" mb-6 flex flex-col justify-center">
          <h4 class="text-neutral-500 pb-4">{{ confirmationMessage }}</h4>
          <p class="body-small text-neutral-l-700">
            {{ informationText }}
          </p>
        </div>
  
        <div v-if="requireReason" class="mt-4">
          <FormText
            :label="reasonLabel"
            required
            v-model="reason"
            type="textarea"
            :placeholder="reasonPlaceholder"
            @input="validateField('reason')"
          ></FormText>
          <span v-if="errors.reason" class="text-danger-300 mt-8 text-xs">
            {{ errors.reason }}
          </span>
        </div>
      </div>
  
      <!-- Modal Footer -->
      <div class="flex items-center gap-4 pt-4 pb-6 mx-6 border-t border-neutral-100">
        <div class="w-full">
          <CommonButton
            :title="cancelButtonText"
            bgColor="bg-neutral-30"
            textColor="text-neutral-500 body-regular hover:bg-neutral-100 !h-10"
            type="button"
            @click="close"
          />
        </div>
  
        <div class="w-full">
          <CommonButton
            :title="actionButtonText"
            :bgColor="actionButtonClass"
            textColor="body-regular text-white !h-10"
            type="submit"
            :createIcon="btnIcon"
            :disabled="requireReason && !reason.trim()"
            @click="confirm"
          />
        </div>
      </div>
    </Dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import FormText from '~/components/common/input/FormText.vue'
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    // More flexible props for custom dialogs
    title: {
      type: String,
      default: 'Confirmation'
    },
    confirmationMessage: {
      type: String,
      default: 'Are you sure you want to proceed with this action?'
    },
    informationText: {
      type: String,
      default: 'This action cannot be undone.'
    },
    icon: {
      type: String,
      default: ''
    },
    btnIcon: {
      type: String,
      default: ''
    },
    // Button configuration
    actionButtonText: {
      type: String,
      default: 'Confirm'
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel'
    },
    actionButtonClass: {
      type: String,
      default: 'bg-primary-300 hover:bg-primary-200'
    },
    // Reason field configuration
    requireReason: {
      type: Boolean,
      default: false
    },
    reasonLabel: {
      type: String,
      default: 'Give a reason'
    },
    reasonPlaceholder: {
      type: String,
      default: 'Enter reason'
    },
    // Optional - for backward compatibility
    type: {
      type: String,
      default: ''
    },
    entityType: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['close', 'confirm'])
  
  const reason = ref('')
  const dialogVisible = ref(false)
  const errors = ref({
    reason: ''
  })
  
  // Watch for changes in the isOpen prop
  watch(
    () => props.isOpen,
    (newVal) => {
      dialogVisible.value = newVal
    }
  )
  
  // Methods
  const close = () => {
    reason.value = ''
    errors.value = { reason: '' }
    dialogVisible.value = false
    emit('close')
  }
  
  const confirm = () => {
    emit('confirm', {
      type: props.type,
      reason: reason.value,
      entityType: props.entityType
    })
    reason.value = ''
    dialogVisible.value = false
  }
  
  const validateField = (field) => {
    if (field === 'reason') {
      errors.value.reason = !reason.value.trim() ? 'Reason is required' : ''
    }
  }
  </script>