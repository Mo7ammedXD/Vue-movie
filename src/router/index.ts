import { createRouter, createWebHistory } from "vue-router";
import MovieDetail from "@/views/Movie.vue";



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
        path: '/movie/:id',
        name: 'MovieDetail',
        component: MovieDetail,
        props: true, 
      },
      {
        path: "/saves",
        name: "Saves",
        component: () => import("@/views/Saves.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),  
  routes,
});



export default router;
