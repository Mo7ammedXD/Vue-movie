<template>
  <v-app :dir="appDirection" class="safe-area-bottom">
    <v-main>
      <NavBar />
      <keep-alive :include="cachedViews">
        <router-view v-slot="{ Component }">
          <transition :name="transitionName" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NavBar from '@/components/navBar/NavBar.vue';
import { useNavItems } from '@/helper/navBar';
import { Capacitor } from '@capacitor/core';
import { SafeArea } from '@capacitor-community/safe-area';

const { locale } = useI18n();
const appDirection = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'));

const route = useRoute();
const { currentNavIndex } = useNavItems();
const previousIndex = ref<number | null>(null);

const isMovieDetail = computed(() => route.name === 'MovieDetail');
const isFirstLoad = computed(() => previousIndex.value === null);

const isForwardNavigation = computed(() => {
  if (previousIndex.value === null) {
    return false;
  }
  return (
    (currentNavIndex.value > previousIndex.value && locale.value === 'en') ||
    (currentNavIndex.value < previousIndex.value && locale.value === 'ar')
  );
});

const transitionName = computed(() => {
  if (isMovieDetail.value || isFirstLoad.value) {
    return 'fade';
  }
  return isForwardNavigation.value ? 'slide-right' : 'slide-left';
});

watch(
  () => route.query,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
);


watch(currentNavIndex, (newIndex, oldIndex) => {
  if (oldIndex !== undefined && newIndex !== oldIndex) {
    previousIndex.value = oldIndex;
  }
});

const cachedViews = ref(['HomeView', 'ProfileView']);


onMounted(() => {
  if (Capacitor.getPlatform() === 'android') {
    SafeArea.enable({
      config: {
        customColorsForSystemBars: true,
        statusBarColor: '#00000000', 
        statusBarContent: 'light',
        navigationBarColor: '#00000000',
        navigationBarContent: 'light',
      },
    });
  }
});
</script>

<style>

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease;
}
.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s ease;
}
.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, var(--safe-area-inset-top, 0px));
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, var(--safe-area-inset-bottom, 0px));
}
</style>
