<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :show-header="false"
    class="w-full max-w-md rounded-2xl p-0 overflow-hidden"
    @hide="onDialogHide"
  >
    <section class="flex items-start justify-between gap-4 px-6 py-5 bg-neutral-surface border-b border-neutral-line">
      <div class="flex items-start gap-3">
        <div
          v-if="icon"
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :class="resolvedIconWrapperClass"
        >
          <BaseCustomIcon :name="icon" :customClass="iconClass" />
        </div>

        <div class="min-w-0">
          <h5 class="text-neutral-primary">
            {{ title }}
          </h5>
        </div>
      </div>

      <CommonButton
        aria-label="Close"
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
        textColor="text-neutral-secondary"
        createIcon="cancel-red"
        @click="close"
      />
    </section>

    <section class="px-6 py-5">
      <p v-if="confirmationMessage" class="body-regular text-neutral-primary mb-2">
        {{ confirmationMessage }}
      </p>

      <p class="body-small text-neutral-secondary">
        {{ informationText }}
      </p>

      <div v-if="requireReason" class="mt-6">
        <FormText
          v-model="reason"
          name="reason"
          type="textarea"
          :label="reasonLabel"
          :placeholder="reasonPlaceholder"
          required
          :error="errors.reason"
          @input="validateField('reason')"
        />
      </div>
    </section>

    <section class="px-6 pb-6 pt-4 border-t border-neutral-line flex items-center gap-4">
      <div class="w-full">
        <CommonButton
          :title="cancelButtonText"
          bgColor="bg-neutral-muted hover:bg-neutral-line !h-12"
          textColor="text-neutral-primary"
          type="button"
          fullWidth
          @click="close"
        />
      </div>

      <div class="w-full">
        <CommonButton
          :title="actionButtonText"
          :bgColor="actionButtonClass + ' !h-12'"
          textColor="text-neutral-inverted"
          type="button"
          fullWidth
          :createIcon="btnIcon"
          :disabled="requireReason && !reason.trim()"
          @click="confirm"
        />
      </div>
    </section>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import Joi from 'joi'

import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  confirmationMessage: {
    type: String,
    default: ''
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
  iconWrapperClass: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: 'w-5 h-5'
  },
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

const dialogVisible = ref(false)
const didEmitClose = ref(false)

const reason = ref('')
const errors = ref({ reason: '' })

const resolvedIconWrapperClass = computed(() => {
  return props.iconWrapperClass || 'bg-neutral-muted text-primary-300'
})

const reasonSchema = Joi.string().trim().required().messages({
  'string.empty': 'Reason is required',
  'any.required': 'Reason is required'
})

watch(
  () => props.isOpen,
  (newVal) => {
    dialogVisible.value = newVal

    if (newVal) {
      didEmitClose.value = false
      reason.value = ''
      errors.value = { reason: '' }
    }
  },
  { immediate: true }
)

const validateField = (field) => {
  if (field !== 'reason') return

  const { error } = reasonSchema.validate(reason.value)
  errors.value.reason = error ? error.details[0].message : ''
}

const close = () => {
  if (didEmitClose.value) return

  didEmitClose.value = true
  dialogVisible.value = false
  emit('close')
}

const onDialogHide = () => {
  if (props.isOpen) close()
}

const confirm = () => {
  if (props.requireReason) {
    validateField('reason')
    if (errors.value.reason) return
  }

  emit('confirm', {
    type: props.type,
    reason: reason.value,
    entityType: props.entityType
  })

  close()
}
</script>

