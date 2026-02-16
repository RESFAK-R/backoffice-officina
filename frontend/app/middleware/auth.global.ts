export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

    // Allow access to auth pages without login
    if (to.path.startsWith('/auth')) {
        // If already logged in, redirect to dashboard
        if (user.value) {
            return navigateTo('/')
        }
        return
    }

    // Protect all other routes - require authentication
    if (!user.value) {
        return navigateTo('/auth/login')
    }
})
