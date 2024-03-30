// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/search",
        name: "Search",
        component: () => import("@/views/Search.vue"),
      },
      {
        path: "/movie/:id(\\d+)",
        name: "Movie",
        component: () => import("@/views/Movie.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
