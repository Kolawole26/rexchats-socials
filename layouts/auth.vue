<template>
  <div class="min-h-screen bg-neutral-background flex">
    <!-- Left Pattern/Image side (hidden on smaller screens) -->
    <div class="hidden lg:flex lg:w-[58%] relative overflow-hidden">
      <img
        src="~/assets/images/auth-bg-image.jpg"
        alt="Authentication background pattern"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Glassmorphism card -->
      <div
        class="absolute bottom-12 left-12 w-[78%] max-w-[560px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-neutral-inverted shadow-2xl"
      >
        <h2 class="text-3xl font-bold mb-4 leading-tight">Automate Sales. Stay in Control.</h2>
        <p class="text-base leading-relaxed">
          Connect your business, manage orders, track shipments, and monitor payments — all in one powerful platform.
        </p>
      </div>
    </div>

    <!-- Right Content side -->
    <div
      class="w-full lg:w-[42%] bg-neutral-background flex items-center lg:items-start justify-center p-6 sm:p-12 lg:pt-20"
    >
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// Auth layout for authentication pages
</script>
