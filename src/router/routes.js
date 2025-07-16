const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    meta: { requiresGuest: true },
    children: [
      {
        path: "",
        component: () => import("pages/AuthPage.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("pages/DashboardPage.vue"),
      },
    ],
  },
  {
    path: "/projects",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("pages/ProjectsPage.vue"),
      },
      {
        path: "new",
        component: () => import("pages/CreateProjectPage.vue"),
      },
      {
        path: ":id",
        component: () => import("pages/ProjectDetailPage.vue"),
      },
    ],
  },
  {
    path: "/profile",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("pages/ProfilePage.vue"),
      },
    ],
  },
  {
    path: "/site/:id",
    component: () => import("layouts/PublicLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PublicSitePage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
]

export default routes


