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
  
      <form @submit.prevent="onSubmit" class=" p-6">
        <client-only>
          <Vue3Lottie
          :height="112"
          :width="112"
          :animationData="animationData"
        />
        </client-only>

        <div class=" text-center mt-10 mb-8">
            <h4 class=" mb-4 max-w-[278px] mx-auto">{{ subtitle }}</h4>
            <p class=" body-normal text-neutral-200">{{ message }}</p>
        </div>
  
        <!-- Modal Footer -->
        <div class="border-t border-neutral-100 pt-4">
        <CommonButton
          :title="primaryButtonText"
          bgColor="bg-neutral-30"
          textColor="text-neutral-500 font-semibold text-sm"
          type="button"
          @click="emit('close')"
        />
      </div>
      </form>
    </Dialog>
  </template>
  
  <script setup>
  import { ref, computed, defineProps, defineEmits } from "vue";
  import animationData from "@/assets/animations/success.json";
  // Props for dynamic content
  const props = defineProps({
    isVisible: { type: Boolean, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    message: { type: String, default: "" },
    icon: { type: String, default: "" },
    // buttonColor: { type: String, default: "bg-primary-300 text-neutral-500" },
    primaryButtonText: { type: String, default: "OK" },
  });
  
  // Emit events for actions
  const emit = defineEmits(["update:isVisible", "primaryAction", "close", "back"]);
  
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
  
  </script>
  
  <style scoped>
  /* Add additional custom styles if needed */
  </style>
  