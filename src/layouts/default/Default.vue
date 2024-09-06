<template>
    <v-app>
      <v-main>
        <transition :name="transitionName" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </v-main>
      <NavBar />
    </v-app>
  </template>


  <script lang="ts" setup>
  import { computed } from "vue";
  import NavBar from "@/components/footer/NavBar.vue";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  
  const transitionName = computed(() => {
    window.scroll({
  top: 0,
  behavior: 'smooth', 
});
    switch (route.name) {
      case "Home":
        return "slide-right"; 
      case "Search":
        return "slide-left";  
      case "MovieDetail":
        return "slide-up";       
      case "Saves":
        return "slide-left";   
      default:
        return "fade";        
    }

  });
  </script>
  
  <style>
  .slide-right-enter-active, .slide-right-leave-active {
    transition: transform 0.2 ease;
  }
  .slide-right-enter, .slide-right-leave-to {
    transform: translateX(100%);
  }
  
  .slide-left-enter-active, .slide-left-leave-active {
    transition: transform 0.2s ease;
  }
  .slide-left-enter, .slide-left-leave-to {
    transform: translateX(-100%);
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease-in-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  .slide-up-enter-active, .slide-up-leave-active {
    transition: transform 0.4s ease;
  }
  .slide-up-enter, .slide-up-leave-to {
    transform: translateY(100%);
  }
  </style>
  