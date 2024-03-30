<template>
  <v-footer class="bg-black display-fixed">
    <v-bottom-navigation class="bg-black" grow >
      <v-btn :class="{ 'bg-yellow': isHomeActive }" to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn :class="{ 'bg-yellow': isSearchActive }" to="/search">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn>
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isHomeActive = computed(() => route.path === '/');
const isSearchActive = computed(() => route.path === '/search');
</script>


