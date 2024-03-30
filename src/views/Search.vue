<template>
  <v-card class="mx-auto" color="black" width="95%">
    <v-card-text >
      <v-text-field

        :loading="isFetchingPeers"
        density="compact"
        variant="solo"
        label="Search templates"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        v-model="userSearch"
        @click:append-inner="onClick()"
        @keyup.enter="onClick()"
      ></v-text-field>
    </v-card-text>


  <v-container >
    <h2 class="text-white">Search</h2>

<v-row no-gutters  >
  <v-col
  v-for="movie in search"
  :key="movie.id"
    cols="12"
    sm="4"
    class="item mb-10 "
  >

       <MovieCard  :movie="movie"></MovieCard>

  </v-col>
</v-row>
  </v-container>




  </v-card>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { Movie } from "@/types/Movie";
import { useQuery } from "@tanstack/vue-query";
import { list_movies } from "@/helper/axios";
import { AxiosResponse } from "axios";
import MovieCard from '@/components/shared/MovieCard.vue'
const userSearch = ref("");
const page = ref(1)
const limit = ref(5)
const onClick = () => {
  page.value=1

  refetch()
};



const { data:search , isFetching: isFetchingPeers,refetch } = useQuery({
  queryKey: ["moviesSearch"],
  queryFn: async ( ) => {
    const response: AxiosResponse<Movie[] | any> = await list_movies.get("/", {
      params: {
        sort_by: "like_count",
        limit:limit.value,
        page:page.value,
        query_term:userSearch.value
      },
    });
    limit.value=50


    return response.data.data?.movies as Movie[];
  },
});

</script>
