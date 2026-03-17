<template>
  <ModalConfirmation
    :isOpen="isOpen"
    v-bind="config"
    @close="close"
    @confirm="confirm"
  />
</template>

<script setup>
const { isOpen, config, close, confirm } = useConfirmationModal()
</script>
