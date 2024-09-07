<template>
  <v-app :dir="appDirection">
    <v-main>
      <NavBar />
      <router-view v-slot="{ Component }" >
        <transition :name="transitionName" mode="out-in"> 
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import NavBar from "@/components/navBar/NavBar.vue";
import { useNavItems } from "@/helper/navBar";

const { locale } = useI18n();

const appDirection = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr')); 

const route = useRoute();
const { navItems, currentNavIndex } = useNavItems(); 
const previousIndex = ref<number | null>(null);

const transitionName = computed(() => {
  window.scroll({
    top: 0,
    behavior: 'smooth', 
  });

  if (route.name === "MovieDetail") {
    return "fade"; 
  }

  if (previousIndex.value === null) {
    return "fade"; 
  } else if (currentNavIndex.value < previousIndex.value && locale.value === "en" || currentNavIndex.value > previousIndex.value && locale.value === "ar") {
    return "slide-left"; 
  } else if (currentNavIndex.value > previousIndex.value && locale.value === "en" || currentNavIndex.value < previousIndex.value && locale.value === "ar") {
    return "slide-right"; 
  } else {
    return "slide-up"; 
  }
});

watch(currentNavIndex, (newIndex, oldIndex) => {
  previousIndex.value = oldIndex; 
});
</script>

<style>
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.4s ease;
}
.slide-left-enter, .slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.4s ease;
}
.slide-right-enter, .slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.1s ease;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
