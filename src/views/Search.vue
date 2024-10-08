<template>
  <v-card class="mx-auto mb-4 pa-4" color="black" width="100%">
    <v-card-text>
      <v-text-field
        color="primary"
        :loading="isFetchingPeers"
        density="compact"
        variant="outlined"
        :label="$t('searchPage.searchMovies')" 
        append-inner-icon="mdi-magnify"
        clearable
        single-line
        hide-details
        v-model="userSearch"
      ></v-text-field>
    </v-card-text>

    <v-container class="bg-movie">
      <h2 class="text-white">{{ $t('searchPage.searchMovies') }}</h2> 

      <p v-if="search?.length" class="text-white mb-2">
        {{ $t('searchPage.resultsFound', { count: totalResults }) }} "{{ userSearch }}"
      </p>
      <p v-if="!search?.length && !isFetchingPeers && userSearch" class="text-white">
        {{ $t('searchPage.noResults') }} "{{ userSearch }}"
      </p>

      <v-row no-gutters>
        <div v-for="movie in search" :key="movie.id" class="item mb-3">
          <MovieCard :movie="movie" ></MovieCard>
        </div>
      
      </v-row>
      <v-pagination
        v-if="totalPages > 1"
        v-model="page"
        :length="totalPages"
        @input="onPageChange"
      ></v-pagination>
    </v-container>
  </v-card>
</template>


<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Movie } from "@/types/Movie";
import { useQuery } from "@tanstack/vue-query";
import { list_movies } from "@/helper/axios";
import { AxiosResponse } from "axios";
import debounce from "lodash/debounce";
import MovieCard from '@/components/shared/MovieCard.vue';

const userSearch = ref("");
const page = ref(1);
const limit = ref(14);  
const totalResults = ref(0);

const { data: search, isFetching: isFetchingPeers, refetch } = useQuery({
  queryKey: ["moviesSearch", userSearch, page], 
  queryFn: async () => {
    const response: AxiosResponse<Movie[] | any> = await list_movies.get("/", {
      params: {
        sort_by: "like_count",
        limit: limit.value,
        page: page.value,
        query_term: userSearch.value,
      },
    });
    totalResults.value = response.data.data?.movie_count || 0;
    return response.data.data?.movies as Movie[];
  },
  staleTime: 0,
});

const executeSearch = debounce(() => {
  page.value = 1;  
  refetch();      
}, 300);           

watch(userSearch, () => {
  if (!userSearch.value.trim()) return; 
  executeSearch();
});


const totalPages = computed(() => {
  return Math.ceil(totalResults.value / limit.value);
});

const onPageChange = (newPage: number) => {
  page.value = newPage;
  refetch();
};
</script>
