<template>
  <v-card class="mx-auto" color="black" width="100%">
    <v-container class="bg-movie">
      <h2 class="text-white">{{ $t('saves.saved') }}</h2>

      <v-row no-gutters v-if="saveMoviesStore.settings.movieToSave.length > 0">
        <div v-for="movie in saveMoviesStore.settings.movieToSave" :key="movie.id" class="item">
          <MovieCard :movie="movie"></MovieCard>
        </div>
      </v-row>

      <v-row no-gutters v-else class="text-center">
        <div class="mt-10 ma-auto">
          <h4>{{ $t('saves.noMovies') }}<br /> {{ $t('saves.startAdding') }}</h4>
        </div>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { useSaveMovieStore } from '@/store/saves';
import MovieCard from '@/components/shared/MovieCard.vue';

const saveMoviesStore = useSaveMovieStore();
</script>
