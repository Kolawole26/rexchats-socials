import { ref, shallowRef } from 'vue'

const defaultConfig = {
  title: 'Confirmation',
  confirmationMessage: '',
  informationText: 'This action cannot be undone.',
  icon: '',
  btnIcon: '',
  actionButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  actionButtonClass: 'bg-primary-300 hover:bg-primary-200',
  requireReason: false,
  reasonLabel: 'Give a reason',
  reasonPlaceholder: 'Enter reason',
  entityType: '',
  type: '',
  iconWrapperClass: '',
  iconClass: 'w-5 h-5'
}

const isOpen = ref(false)
const config = ref({ ...defaultConfig })
const confirmHandler = shallowRef(null)

export function useConfirmationModal() {
  const open = (nextConfig = {}) => {
    const { onConfirm, ...uiConfig } = nextConfig || {}
    config.value = { ...defaultConfig, ...uiConfig }
    confirmHandler.value = typeof onConfirm === 'function' ? onConfirm : null
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    confirmHandler.value = null
  }

  const confirm = (payload) => {
    const handler = confirmHandler.value
    close()
    if (typeof handler === 'function') handler(payload)
  }

  return {
    isOpen,
    config,
    open,
    close,
    confirm
  }
}
