<!-- error.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-primary-50">
      <div
        class="max-w-md w-full px-6 py-12 bg-white rounded-lg shadow-lg text-center"
      >
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-gray-200">{{ error.statusCode }}</h1>
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
                <BaseCustomIcon name="error" />
          </div>
        </div>
        <!-- Message -->
        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ error.message || "Page not found" }}</h2>
        <p class="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
  
        <button @click="handleError" class=" bg-primary-500 p-3 rounded-lg" > Back to Home</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useError } from '#app'
  
  // Get the error from Nuxt's error handling system
  const error = useError()
  
  // Function to clear the error and redirect
  const handleError = () => {
    clearError({ redirect: '/' })
  }
  </script>

