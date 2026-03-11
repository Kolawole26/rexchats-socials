export default defineNuxtRouteMiddleware((to) => {
    // For demo purposes, list all your valid routes
    // In a real app, you might check against your router's routes
    const validRoutes = ['/', '/about', '/contact', '/products']
    
    if (!validRoutes.includes(to.path)) {
      // For specific routes you want to check
      if (to.path === '/test') {
        // This will show the 404 page
        throw createError({
          statusCode: 404,
          message: 'The test page does not exist'
        })
      }
    }
  })