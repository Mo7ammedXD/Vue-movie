<script lang="ts" setup>
import { ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { list_movies } from "@/helper/axios";
import type { Movie } from "@/types/Movie";
import MovieCard from '@/components/shared/MovieCard.vue';



const genres = ref([
  { value: "all", label: "All" },
  { value: "action", label: "Action" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "horror", label: "Horror" },
  { value: "thriller", label: "Thriller" },
  { value: "romance", label: "Romance" },
  { value: "mystery", label: "Mystery" },
  { value: "crime", label: "Crime" },
  { value: "adventure", label: "Adventure" },
  { value: "fantasy", label: "Fantasy" },
  { value: "animation", label: "Animation" },
  { value: "family", label: "Family" },
  { value: "biography", label: "Biography" },
  { value: "documentary", label: "Documentary" },
  { value: "history", label: "History" },
  { value: "war", label: "War" },
  { value: "music", label: "Music" },
  { value: "sport", label: "Sport" },
  { value: "western", label: "Western" },
  { value: "sci-fi", label: "Sci-Fi" },
]);

const genre = ref("all");

const fetchMovies = async () => {
  const [byRatingResponse, byDownloadResponse, byAddDateResponse] = await Promise.all([
    list_movies.get("/", { params: { sort_by: "rating", limit: 20, genre: genre.value } }),
    list_movies.get("/", { params: { sort_by: "download_count", limit: 20, genre: genre.value } }),
    list_movies.get("/", { params: { sort_by: "date_added", limit: 5, genre: genre.value } })
  ]);

  return {
    byRating: byRatingResponse.data.data?.movies as Movie[],
    byDownload: byDownloadResponse.data.data?.movies as Movie[],
    byAddDate: byAddDateResponse.data.data?.movies as Movie[]
  };
};

const { data, isFetching, refetch } = useQuery({
  queryKey: ["movies", genre],
  queryFn: fetchMovies,
  staleTime: 1000 * 60 * 5 
});

watch(genre, () => {
  refetch(); 
});
</script>

<template>
  <v-card class="mx-auto" color="black" width="100%">
    <div class="pa-4">
      <v-chip-group
        v-model="genre"
        row
        mandatory
        class="pa-4 genre-chip-group"
        active-class="genre-active"
      >
        <v-chip
          color="primary"
          v-for="genreOption in genres"
          :key="genreOption.value"
          :value="genreOption.value"
          class="mx-2 genre-chip px-4"
          :active="genre === genreOption.value"
        >
          {{ $t(`genres.${genreOption.value}`) }} 
        </v-chip>
      </v-chip-group>
    </div>

    <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
      <h2 class="text-white">{{ $t('movieSections.byRating') }}</h2>
      <div class="horizontal-scroll d-flex">
        <div v-for="movie in data?.byRating" :key="movie.id" class="item me-4 mb-2">
          <MovieCard :movie="movie" :is-fetching="isFetching"></MovieCard>
        </div>
      </div>
    </div>

    <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
      <h2 class="text-white">{{ $t('movieSections.byDownload') }}</h2> 
      <div class="horizontal-scroll d-flex">
        <div v-for="movie in data?.byDownload" :key="movie.id" class="item me-4 mb-2">
          <MovieCard :movie="movie" :is-fetching="isFetching"></MovieCard>
        </div>
      </div>
    </div>

    <div class="ma-4 mb-4 mb-10 pa-6">
      <h2 class="text-white">{{ $t('movieSections.comingSoon') }}</h2> 
      <v-carousel color="primary" height="400" width="600" show-arrows="hover" cycle hide-delimiter-background>
        <v-carousel-item v-for="slide in data?.byAddDate" :key="slide.id" :src="slide?.large_cover_image"></v-carousel-item>
      </v-carousel>
    </div>

    <v-container class="bg-movie pa-6 mb-4">
      <h2 class="text-white">{{ $t('movieSections.mostPopular') }}</h2> 
      <v-row no-gutters class="mb-10">
        <div v-for="movie in data?.byDownload" :key="movie.id" class="item mb-2">
          <MovieCard :movie="movie" :is-fetching="isFetching"></MovieCard>
        </div>
      </v-row>
    </v-container>
  </v-card>
</template>
