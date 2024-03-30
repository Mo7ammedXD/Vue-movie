<script lang="ts" setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import type { Movie } from "@/types/Movie";

const props = defineProps({
  movie: {
    type: Object as () => Movie,
    required: true
  }
});

const router = useRouter();

const navigateToMovie = (movieId: number) => {
  router.push(`/movie/${movieId}`);
};
</script>

<template>
  <v-card
    @click="navigateToMovie(movie.id)"
    class="bg-yellow"
    :image="movie.large_cover_image"
    max-width="300"
    height="240"
    min-height="240"
    theme="dark"
  ></v-card>
  <div>
    <v-card-title class="text-wrap title">
      <h6 class="text-white">{{ movie.title }}</h6>
    </v-card-title>
    <v-rating
      :length="1"
      :size="20"
      color="primary"
      active-color="primary"
      :model-value="movie.rating / 2"
      readonly
    ></v-rating>
    <span class="text-white ms-1">{{ movie.rating }}</span>
  </div>
</template>
