<script lang="ts" setup>
import type { Movie } from "@/types/Movie";
import { useQuery } from "@tanstack/vue-query";
import { list_movies } from "@/helper/axios";
import MovieCard from '@/components/shared/MovieCard.vue';

const { data, isFetching, error } = useQuery({
  queryKey: ["moviesData"],
  queryFn: async () => {
    const [byRatingResponse, byDownloadResponse, byAddDateResponse] = await Promise.all([
      list_movies.get("/", { params: { sort_by: "rating", limit: 20 } }),
      list_movies.get("/", { params: { sort_by: "download_count", limit: 20 } }),
      list_movies.get("/", { params: { sort_by: "date_added", limit: 5 } })
    ]);

    return {
      byRating: byRatingResponse.data.data?.movies as Movie[],
      byDownload: byDownloadResponse.data.data?.movies as Movie[],
      byAddDate: byAddDateResponse.data.data?.movies as Movie[]
    };
  },
});


</script>

<template>
   <v-card class="mx-auto" color="black" width="100%"  >
  <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
    <h2 class="text-white ">By Rating</h2>
    <div class="horizontal-scroll d-flex ">
      <div v-for="movie in data?.byRating" :key="movie.id" class="item me-4 mb-2">
      <MovieCard :movie="movie"  :is-fetching="isFetching"></MovieCard>
      </div>
    </div>
  </div>

  <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
    <h2 class="text-white">By Donwload</h2>
    <div class="horizontal-scroll d-flex">
      <div v-for="movie in data?.byDownload" :key="movie.id" class="item me-4 mb-2">
        <MovieCard :movie="movie" :is-fetching="isFetching"></MovieCard>


      </div>
    </div>
  </div>

  <div class="ma-4 mb-4  mb-10 pa-6">
    <h2 class="text-white">Coming Soon</h2>
  <v-carousel
    color="primary"
    height="400"
    width="600"
    show-arrows="hover"
    cycle
    hide-delimiter-background
  >
    <v-carousel-item
      v-for="slide in data?.byAddDate"
      :key="slide.id"
      :src="slide.large_cover_image"
    >

    </v-carousel-item>
  </v-carousel>
  </div>



  <v-container class="bg-movie pa-6 mb-4">
    <h2 class="text-white">The Most Popular</h2>

    <v-row no-gutters class="mb-10 ">
      <div v-for="movie in data?.byDownload" :key="movie.id" class="item mb-2">
        <MovieCard :movie="movie" :is-fetching="isFetching"></MovieCard>
      </div>
    </v-row>
  </v-container>
</v-card>
</template>

