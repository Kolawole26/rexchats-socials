<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script>
export default defineNuxtComponent({
  setup() {
    const config = useRuntimeConfig()
    const isProduction = config.public.env === 'production'

    onBeforeMount(() => {
      const savedTheme = localStorage.getItem('color-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })

    useHead({
      script: isProduction
        ? [
            {
              src: '/newRelic.js',
              async: true,
              defer: true
            }
          ]
        : []
    })
  }
})
</script>

<style>
@import './assets/css/colors.css';
</style>
