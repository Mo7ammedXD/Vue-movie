<template>
  <v-container class="pa-4" fluid>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4" class="text-center">
        <v-card :loading="isFetchingRating" class="filtered-background ma-auto">
          <v-img :src="moiveNow?.large_cover_image" class="w-100"></v-img>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" lg="6">
        <v-card class="w-100 ma-auto " color="primary" >
          <v-card-title class="title ">
            <div class="movie-title ">
              {{ moiveNow?.title }}
            </div>
            <div class="movie-year">
              ({{ moiveNow?.year }})
            </div>
          </v-card-title>

          <v-tabs v-model="tab" bg-color="primary" color="black" >
            <v-tab value="one">Info</v-tab>
            <v-tab v-if="moiveNow?.yt_trailer_code" value="two">Trailers</v-tab>
            <v-tab value="three" v-if="moiveNow?.description_full">About</v-tab>
          </v-tabs>

          <v-card-text class="bg-yellow-400 px-4 py-2">
            <v-window v-model="tab">
              <v-window-item value="one">
                <div class="d-flex align-center mb-2">
                  <v-rating
                    :length="1"
                    :size="30"
                    color="white"
                    active-color="yellow"
                    model-value="1"
                    readonly
                  ></v-rating>
                  <p class="rating-text ml-2 text-black">{{ moiveNow?.rating }}/10</p>
                  <a :href="`https://www.imdb.com/title/${moiveNow?.imdb_code}/`" target="_blank" class="ml-3 text-white">
                    View on IMDb
                  </a>
                </div>

                <v-row>
                  <v-col>
                    <p><strong>Runtime:</strong> {{ moiveNow?.runtime }} minutes</p>
                    <p><strong>Language:</strong> {{ moiveNow?.language }}</p>
                    <p><strong>MPA Rating:</strong> {{ moiveNow?.mpa_rating }}</p>
                  </v-col>
                  <v-col>
                    <p><strong>Uploaded on:</strong> {{ moiveNow?.date_uploaded }}</p>
                    <p><strong>State:</strong> {{ moiveNow?.state }}</p>
                  </v-col>
                </v-row>

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

              <v-window-item value="two">
                <iframe
                  :src="`https://www.youtube.com/embed/${moiveNow?.yt_trailer_code}`"
                  width="100%"
                  height="315"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </v-window-item>

              <v-window-item value="three">
                <p class="story">{{ moiveNow?.description_full }}</p>
              </v-window-item>
            </v-window>
          </v-card-text>

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
                  <h4>{{ torrent.type }} - {{ torrent.quality }} - {{ torrent.size }}</h4>
                </v-btn>
              </div>
            </v-row>
          </v-card>

          <v-card color="black" class="py-8" :loading="isFetchingRelated">
            <div class="ma-4 mb-4 bg-movie mb-10 pa-6">
              <v-card-title class="text-white">Related Movies</v-card-title>

              <div class="horizontal-scroll d-flex">
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
import type  { AxiosResponse } from "axios";
import type { Movie } from "@/types/Movie";
import MovieCard from "@/components/shared/MovieCard.vue";

const vueRouter = useRoute();
const tab = ref();

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
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 2.5vw;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
  word-wrap: break-word;
  word-break: break-word;
}

.movie-title {
  font-size: inherit;
  white-space: normal;
  line-height: 1.2;
}

.movie-year {
  font-size: 16px; 
  margin-top: 8px;
  color: #777;
}

.rating-text {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

.genre-chip {
  background-color: #f0ad4e;
  color: #fff;
}

.download-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background-color: #0056b3;
}

.movie-title {
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}
</style>
