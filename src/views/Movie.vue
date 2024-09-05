<template>
  <v-container class="pa-4" fluid>
    <v-row justify="center">
      <!-- Movie Image Section -->
      <v-col cols="12" md="6" lg="4" class="text-center">
        <v-card :loading="isFetchingRating" class="filtered-background ma-auto">
          <v-img :src="moiveNow?.large_cover_image" class="w-100">
          </v-img>
        </v-card>
      </v-col>

      <!-- Movie Info Section -->
      <v-col cols="12" md="8" lg="6">
        <v-card class="w-100 ma-auto">
          <!-- Movie Title -->
          <v-card-title class="title">{{ moiveNow?.title }}</v-card-title>

          <v-tabs v-model="tab" bg-color="primary" color="white" grow>
            <v-tab value="one">Info</v-tab>
            <v-tab v-if="moiveNow?.yt_trailer_code" value="two">Trailers</v-tab>
            <v-tab value="three" v-if="moiveNow?.description_full">About</v-tab>
          </v-tabs>

          <v-card-text class="bg-yellow-400 px-4 py-2">
            <v-window v-model="tab">
              <!-- Movie Info Tab -->
              <v-window-item value="one">
                <div class="d-flex align-center">
                  <v-rating
                    :length="1"
                    :size="30"
                    color="white"
                    active-color="yellow"
                    model-value="1"
                    readonly
                  ></v-rating>
                  <p class="rating-text ml-2">{{ moiveNow?.rating }}</p>
                </div>
                <v-row class="ma-auto">
                  <v-chip
                    size="small"
                    class="ma-1 pa-2 genre-chip"
                    variant="elevated"
                    v-for="(genre, index) in moiveNow?.genres"
                    :key="index"
                    :color="getOrderStatusColor(genre)"
                  >
                    <p>{{ genre }}</p>
                  </v-chip>
                </v-row>
              </v-window-item>

              <!-- Trailers Tab -->
              <v-window-item value="two">
                <iframe
                  :src="`https://www.youtube.com/embed/${moiveNow?.yt_trailer_code}`"
                  width="100%"
                  height="315"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </v-window-item>

              <!-- About Tab -->
              <v-window-item value="three">
                <p class="story">{{ moiveNow?.description_full }}</p>
              </v-window-item>
            </v-window>
          </v-card-text>

          <!-- Download Section with Icons -->
          <v-card color="black" class="py-8">
            <v-card-title class="text-white">Download Options</v-card-title>
            <v-card-subtitle class="text-grey">Torrent Links</v-card-subtitle>
            <v-row class="itmes">
              <div
                class="ma-2 mb-5"
                v-for="(torrent, index) in moiveNow?.torrents"
                :key="index"
              >
                <v-btn
                  :href="torrent.url"
                  class="download-btn"
                  color="primary"
                  append-icon="mdi-download"
                  elevation="2"
                >
                  <v-icon left>{{ getTorrentIcon(torrent.quality) }}</v-icon>
                  <h4>{{ torrent.type }} - {{ torrent.quality }}</h4>
                </v-btn>
              </div>
            </v-row>
          </v-card>

          <!-- Related Movies Section -->
          <v-card color="black" class="py-8" :loading="isFetchingRelated">
            <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
              <v-card-title class="text-white">Related Movies</v-card-title>

    <div class="horizontal-scroll d-flex ">
      <div v-for="movie in relatedMovies" :key="movie.id" class="item me-4">
      <MovieCard :movie="movie"></MovieCard>
      </div>
    </div>
  </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getOrderStatusColor } from "@/helper/color";
import { movie_details, suggestions } from "../helper/axios";
import { useQuery } from "@tanstack/vue-query";
import { AxiosResponse } from "axios";
import type { Movie } from "@/types/Movie";
import MovieCard from "@/components/shared/MovieCard.vue";

const vueRouter = useRoute();
const tab = ref();

// Function to fetch movie details
const fetchMovieDetails = async (movieId: number) => {
  const response: AxiosResponse<Movie | any> = await movie_details.get("/", {
    params: {
      movie_id: movieId,
    },
  });
  return response.data.data?.movie;
};

const fetchRelatedMovies = async (movieId: number) => {
  const response: AxiosResponse<Movie[] | any> = await suggestions.get("/", {
    params: {
      movie_id: movieId,
    },
  });
  return response.data.data?.movies as Movie[];
};

const { data: moiveNow, refetch: refetchMovieDetails, isFetching: isFetchingRating } = useQuery({
  queryKey: ["Movie", vueRouter.params.id],
  queryFn: () => fetchMovieDetails(Number.parseInt(vueRouter.params.id as string)),
  staleTime: Infinity,
});

const { data: relatedMovies, refetch: refetchRelatedMovies, isFetching: isFetchingRelated } = useQuery({
  queryKey: ["relatedMovies", vueRouter.params.id],
  queryFn: () => fetchRelatedMovies(Number.parseInt(vueRouter.params.id as string)),
  staleTime: Infinity,
});

watch(
  () => vueRouter.params.id,
  (newId) => {
    refetchMovieDetails(); 
    refetchRelatedMovies(); 
  }
);

const getTorrentIcon = (quality: string) => {

  if (quality.includes("1080") ||quality.includes("2160")) return "mdi-video-high-definition";
  return "mdi-download";
};
</script>

<style scoped>
/* Movie Title */
.title {
  font-weight: 800;
  font-size: 24px;
  color: #333;
  padding: 16px 0;
  text-align: center;
}

/* Rating text */
.rating-text {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

/* Genre chip styling */
.genre-chip {
  background-color: #f0ad4e;
  color: #fff;
}

/* Download Button Styling */
.download-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

/* Hover effect for download buttons */
.download-btn:hover {
  background-color: #0056b3;
}

/* Related Movie Title */
.movie-title {
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin-top: 10px;
}

</style>