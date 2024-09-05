<script lang="ts" setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'; 
import type { Movie } from "@/types/Movie";
import { useSaveMovieStore } from '@/store/saves';

const saveMoviesStore = useSaveMovieStore();
const movies = ref<Movie[]>([]);

const props = defineProps({
  movie: {
    type: Object as () => Movie,
    required: true,
  },
});

const router = useRouter();

const isSaved = (movie: Movie) => {
  return movies.value.some(m => m.id === movie.id);
};

const toggleSaveMovie = (movie: Movie) => {
  const index = movies.value.findIndex(m => m.id === movie.id);
  if (index === -1) {
    movies.value.push(movie); 
  } else {
    movies.value.splice(index, 1); 
  }
};

const navigateToMovie = () => {
  router.push({ name: 'MovieDetail', params: { id: props.movie.id } });
};

onMounted(() => {
  movies.value = saveMoviesStore.settings.movieToSave;
});

watch(movies, (newMovies) => {
  saveMoviesStore.updateMovieSettings(newMovies);
});
</script>


<template>
  <v-card
    @click="navigateToMovie" 
    class="bg-yellow ma-1"
    :image="movie.medium_cover_image"
    max-width="300"
    height="240"
    min-height="240"
    theme="dark"
  >
    <v-card-actions class="pa-0" @click.stop="toggleSaveMovie(movie)">
      <v-btn icon>
        <v-icon size="40" :color="isSaved(movie) ? 'yellow' : 'white'">
          mdi-bookmark
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

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
