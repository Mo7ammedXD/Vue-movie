<script lang="ts" setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import type { Movie } from "@/types/Movie";
import { useSaveMovieStore } from '@/store/saves';

// Import store
const saveMoviesStore = useSaveMovieStore();
const movies = ref<Movie[]>([]);

// Define props for the movie
const props = defineProps({
  movie: {
    type: Object as () => Movie,
    required: true,
  },
});

// Check if the movie is saved
const isSaved = (movie: Movie) => {
  return movies.value.some(m => m.id === movie.id);
};

// Add or remove the movie from the saved list
const toggleSaveMovie = (movie: Movie) => {
  const index = movies.value.findIndex(m => m.id === movie.id);
  if (index === -1) {
    movies.value.push(movie); // Add the movie
  } else {
    movies.value.splice(index, 1); // Remove the movie
  }
};

// On component mount, load saved movies from the store
onMounted(() => {
  movies.value = saveMoviesStore.settings.movieToSave;
});

// Watch for changes in the saved movies and update the store
watch(movies, (newMovies) => {
  saveMoviesStore.updateMovieSettings(newMovies);
});
</script>



<template>
  <v-card
    :to="{ name: 'MovieDetail', params: { id: movie.id } }"
    class="bg-yellow ma-1"
    :image="movie.medium_cover_image"
    max-width="300"
    height="240"
    min-height="240"
    theme="dark"
  >
    <!-- Save button, stops event propagation to prevent navigating on save -->
    <v-card-actions class="pa-0" @click.stop="toggleSaveMovie(movie)">
      <v-btn icon>
        <v-icon size="40" :color="isSaved(movie) ? 'yellow' : 'white'">
          mdi-bookmark
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Movie Title and Rating -->
  <div class="movie-info mt-2">
    <v-card-title class="text-wrap title">
      <h6 class="text-white">{{ movie.title }}</h6>
    </v-card-title>
    <div class="d-flex align-center">
      <v-rating
        :length="5"
        :size="20"
        color="primary"
        active-color="primary"
        :model-value="movie.rating / 2"
        readonly
      ></v-rating>
      <span class="text-white ms-1">{{ movie.rating }}</span>
    </div>
  </div>
</template>


