<template>
  <v-app :dir="appDirection" >
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


</style>
