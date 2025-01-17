<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from "vue";
import { useInfiniteQuery } from "@tanstack/vue-query";
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

const fetchMovies = async ({ pageParam = 1, sort_by }: { pageParam?: number, sort_by: string }) => {
  const response = await list_movies.get("/", { 
    params: { sort_by, limit: 20, page: pageParam, genre: genre.value } 
  });
  return { movies: response.data.data?.movies as Movie[], nextPage: pageParam + 1 };
};

const ratingQuery = useInfiniteQuery({
  queryKey: ["movies", "rating", genre],
  queryFn: ({ pageParam }) => fetchMovies({ pageParam, sort_by: "rating" }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  initialPageParam: 1,
});

const downloadQuery = useInfiniteQuery({
  queryKey: ["movies", "download", genre],
  queryFn: ({ pageParam }) => fetchMovies({ pageParam, sort_by: "download_count" }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  initialPageParam: 1,
});

const comingSoonQuery = useInfiniteQuery({
  queryKey: ["movies", "comingSoon", genre],
  queryFn: ({ pageParam }) => fetchMovies({ pageParam, sort_by: "date_added" }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  initialPageParam: 1,
});

const handleScroll = (event: Event, query: any) => {
  const target = event.target as HTMLElement;
  const isRTL = getComputedStyle(target).direction === 'rtl';

  let scrollPosition = target.scrollLeft;
  if (isRTL) {
    scrollPosition = Math.abs(target.scrollLeft);
  }

  if (scrollPosition + target.clientWidth >= target.scrollWidth - 10) {
    if (!query.isFetching.value && query.hasNextPage.value) {
      query.fetchNextPage();
    }
  }
};


onMounted(() => {
  nextTick(() => {
    document.querySelectorAll('.horizontal-scroll').forEach((element, index) => {
      if (index === 0) element.addEventListener('scroll', (e) => handleScroll(e, ratingQuery));
      if (index === 1) element.addEventListener('scroll', (e) => handleScroll(e, downloadQuery));
    });
  });
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
        <template v-for="page in ratingQuery.data?.value?.pages" :key="page.nextPage">
          <div v-for="movie in page.movies" :key="movie.id" class="item me-4 mb-2">
            <MovieCard :movie="movie" :is-fetching="ratingQuery.isFetching.value"></MovieCard>
          </div>
        </template>
      </div>
    </div>
    <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
      <h2 class="text-white">{{ $t('movieSections.byDownload') }}</h2>
      <div class="horizontal-scroll d-flex">
        <template v-for="page in downloadQuery.data?.value?.pages" :key="page.nextPage">
          <div v-for="movie in page.movies" :key="movie.id" class="item me-4 mb-2">
            <MovieCard :movie="movie" :is-fetching="downloadQuery.isFetching.value"></MovieCard>
          </div>
        </template>
      </div>
    </div>
    <div class="ma-4 mb-4 mb-10 pa-6">
      <h2 class="text-white">{{ $t('movieSections.comingSoon') }}</h2> 
      <v-carousel color="primary" height="400" width="600" show-arrows="hover" cycle hide-delimiter-background>
        <v-carousel-item v-for="slide in comingSoonQuery.data.value?.pages?.flatMap(page => page.movies)" :key="slide.id" :src="slide?.large_cover_image"></v-carousel-item>
      </v-carousel>
    </div>

    <v-container class="bg-movie pa-6 mb-4">
      <h2 class="text-white">{{ $t('movieSections.mostPopular') }}</h2> 
      <v-row no-gutters class="mb-10">
        <div v-for="movie in downloadQuery.data?.value?.pages?.flatMap(page => page.movies)" :key="movie.id" class="item mb-2">
          <MovieCard :movie="movie" :is-fetching="downloadQuery.isFetching.value"></MovieCard>
        </div>
      </v-row>
    </v-container>
  </v-card>
</template>


<style scoped>
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  padding-bottom: 10px;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.item {
  flex: 0 0 auto;
}

</style>