<script lang="ts" setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Movie } from "@/types/Movie";
import {useSaveMovieStore} from '@/store/saves'
const saveMoviesStore = useSaveMovieStore()
const movies  = ref<Movie[]>([])



const props = defineProps({
  movie: {
    type: Object as () => Movie,
    required: true
  }
});
const isSaved = (Movie:Movie) => {
  return movies.value.some(m => m.id === Movie.id);
};
const router = useRouter();
const navigateToMovie = (movieId: number) => {
  router.push(`/movie/${movieId}`);
};
const pushMovie = (Movie:Movie) => {
  const index = movies.value.findIndex(m => m.id === Movie.id);

  if (index === -1) {
    movies.value.push(Movie);
  } else {
    movies.value.splice(index, 1);
  }
};


onMounted(() => {
  movies.value = saveMoviesStore.settings.movieToSave
})
watch(movies, (newMovie) => {
  saveMoviesStore.updateMovieSettings(newMovie)

})
</script>

<template>

  <v-card
    @click="navigateToMovie(movie.id)"
    class="bg-yellow ma-1"
    :image="movie.large_cover_image"
    max-width="300"
    height="240"
    min-height="240"
    theme="dark"
  >
  <v-card-actions class="pa-0"  @click.stop="pushMovie(movie)">
    <v-btn>
        <v-icon size="40" :color="isSaved(movie) ? 'yellow' : 'white'"  >mdi-bookmark</v-icon>
      </v-btn>
          </v-card-actions>
  </v-card>
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
