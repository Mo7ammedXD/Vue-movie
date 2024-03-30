// Utilities
import { defineStore } from "pinia";
import { AxiosResponse, list_movies, movie_details } from "../helper/axios";
import type { Movie } from "../types/Movie";
export const useAppStore = defineStore("app", {
  state: () => ({
    movies: <Movie[]>[],
    page: 1,
    limit: 10,
  }),
  actions: {
    async fetchMovies(sort_by?: string, limit: number = 20) {
      const response: AxiosResponse<Movie[] | any> = await list_movies.get(
        "/",
        {
          params: {
            sort_by: sort_by,
            limit: limit,
          },
        }
      );
      return response.data.data?.movies;
    },
    async fetchMovie(id: number) {
  
      const response: AxiosResponse<Movie | any> = await movie_details.get(
        "/",
        {
          params: {
            movie_id: id,
          },
        }
      );
      return response.data.data?.movie;
    },
  },
});
