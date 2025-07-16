import { route } from "quasar/wrappers"
import { createRouter, createWebHashHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"
import routes from "./routes"

export default route((/* { store, ssrContext } */) => {
  const createHistory = createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation guards
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Wait for auth to initialize on first load
    if (!authStore.initialized) {
      try {
        await authStore.initializeAuth()
      } catch (error) {
        console.error("Error initializing auth:", error)
      }
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

    if (requiresAuth && !authStore.isAuthenticated) {
      next("/login")
    } else if (requiresGuest && authStore.isAuthenticated) {
      next("/dashboard")
    } else {
      next()
    }
  })

  return Router
})


