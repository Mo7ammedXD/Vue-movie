<template>
  <v-footer class="bg-black display-fixed" v-if="isMobile">
    <v-bottom-navigation class="bg-black" grow>
      <v-btn :class="{ 'bg-yellow': isHomeActive }" to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn :class="{ 'bg-yellow': isSearchActive }" to="/search">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn :class="{ 'bg-yellow': isSavesActive }" to="/saves">
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>

  <v-app-bar v-else class="bg-black">
    <v-toolbar-title ><span class="text-yellow">XD</span>MOVIE</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn :class="{ 'bg-yellow': isHomeActive }" to="/" >
      <v-icon>mdi-home</v-icon> Home
    </v-btn>

    <v-btn :class="{ 'bg-yellow': isSearchActive }" to="/search" >
      <v-icon>mdi-magnify</v-icon> Search
    </v-btn>

    <v-btn :class="{ 'bg-yellow': isSavesActive }" to="/saves" >
      <v-icon>mdi-bookmark</v-icon> Saves
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

const route = useRoute();
const display = useDisplay();

const isHomeActive = computed(() => route.path === '/');
const isSearchActive = computed(() => route.path === '/search');
const isSavesActive = computed(() => route.path === '/saves');

const isMobile = computed(() => display.width.value < 600);
</script>

