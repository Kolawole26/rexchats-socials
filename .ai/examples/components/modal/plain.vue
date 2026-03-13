<template>
  <Dialog
    v-model:visible="modalVisible"
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
        <h5 v-if="title" class="text-base">{{ title }}</h5>
      </div>
      <button @click="closeModal">
        <i
          class="pi pi-times text-neutral-500 text-base hover:bg-primary-50 p-3 hover:rounded-full"
        />
      </button>
    </div>

    <!-- Modal Body -->
    <div class="px-6 py-6 mb-9">
      <h4 v-if="subtitle" class="body-normal font-medium mb-4 text-neutral-500">
        {{ subtitle }}
      </h4>
      <p
        v-if="message"
        class="body-normal text-neutral-200"
        v-html="message"
      ></p>
    </div>

    <!-- Modal Footer -->
    <div
      v-if="footer"
      class="flex items-center gap-4 pt-4 pb-6 mx-6 border-t border-neutral-100"
    >
      <div class="w-full">
        <CommonButton
          title="Cancel"
          bgColor="bg-neutral-30"
          textColor="text-neutral-500 font-semibold text-sm"
          type="button"
          @click="closeModal"
        />
      </div>

      <div class="w-full">
        <CommonButton
          :title="primaryButtonText"
          :bgColor="buttonColor"
          textColor="font-semibold text-sm"
          type="submit"
          :loading="isLoading"
          @click="onPrimaryAction"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

// Props for dynamic content
const props = defineProps({
  isVisible: { type: Boolean, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  message: { type: String, default: "" },
  icon: { type: String, default: "" },
  buttonColor: { type: String, default: "bg-primary-300 text-neutral-500" },
  primaryButtonText: { type: String, default: "Submit" },
  showLockIcon: { type: Boolean, default: false },
  showBackButton: { type: Boolean, default: false },
  footer: { type: Boolean, default: false },
});

// Emit events for actions
const emit = defineEmits([
  "update:isVisible",
  "primaryAction",
  "close",
  "back",
]);

// Use a computed property to handle v-model binding
const modalVisible = computed({
  get: () => props.isVisible,
  set: (value) => emit("update:isVisible", value),
});

// Handlers for button actions
const closeModal = () => {
  emit("close");
};

const onPrimaryAction = () => {
  emit("primaryAction");
};

const onBack = () => {
  emit("back");
};

// // Watch for changes in `props.resetPin` and update `resetPinModel`
// watch(
//   () => props.resetPin,
//   (newValue) => {
//     resetPinModel.value = newValue;
//   }
// );
</script>

<style scoped>
/* Add additional custom styles if needed */
</style>
