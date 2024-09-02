<script lang="ts" setup>
import type { Movie } from "@/types/Movie";
import { useQuery } from "@tanstack/vue-query";
import { list_movies } from "@/helper/axios";
import { AxiosResponse } from "axios";
import MovieCard from '@/components/shared/MovieCard.vue'

const { data: byRating, isFetching: isFetchingRating } = useQuery({
  queryKey: ["moviesByRating"],
  queryFn: async () => {
    const response: AxiosResponse<Movie[] | any> = await list_movies.get("/", {
      params: {
        sort_by: "rating",
        limit: 20,
      },
    });
    return response.data.data?.movies;
  },
});

const { data: byDownload, isFetching: isFetchingDownload } = useQuery({
  queryKey: ["moviesByDownload"],
  queryFn: async () => {
    const response: AxiosResponse<Movie[] | any> = await list_movies.get("/", {
      params: {
        sort_by: "download_count",
        limit: 20,
      },
    });
    return response.data.data?.movies;
  },
});

const { data: byAddDate, isFetching: isFetchingAddDate } = useQuery({
  queryKey: ["moviesByAddDate"],
  queryFn: async () => {
    const response: AxiosResponse<Movie[] | any> = await list_movies.get("/", {
      params: {
        sort_by: "date_added",
        limit: 5,
      },
    });

    return response.data.data?.movies as Movie[];
  },
});


// const { data: byPeers, isFetching: isFetchingPeers } = useQuery({
//   queryKey: ["moviesbyPeers"],
//   queryFn: async () => {
//     const response: AxiosResponse<Movie[] | any> = await list_movies.get("/", {
//       params: {
//         sort_by: "like_count",
//         limit: 50,
//       },
//     });

//     return response.data.data?.movies as Movie[];
//   },
// });
</script>

<template>
   <v-card class="mx-auto" color="black" width="100%"  >
  <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
    <h2 class="text-white ">By Rating</h2>
    <div class="horizontal-scroll d-flex ">
      <div v-for="movie in byRating" :key="movie.id" class="item me-4">
      <MovieCard :movie="movie"></MovieCard>
      </div>
    </div>
  </div>

  <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
    <h2 class="text-white">By Donwload</h2>
    <div class="horizontal-scroll d-flex">
      <div v-for="movie in byDownload" :key="movie.id" class="item me-4">
        <MovieCard :movie="movie"></MovieCard>


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
      v-for="slide in byAddDate"
      :key="slide.id"
      :src="slide.large_cover_image"
    >

    </v-carousel-item>
  </v-carousel>
  </div>



  <v-container class="bg-movie pa-6">
    <h2 class="text-white">The Most Popular</h2>

    <v-row no-gutters class="mb-10 ">
      <div v-for="movie in byDownload" :key="movie.id" class="item ">
        <MovieCard :movie="movie"></MovieCard>
      </div>
    </v-row>
  </v-container>
</v-card>
</template>

