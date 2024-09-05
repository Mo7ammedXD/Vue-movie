import axios, { AxiosResponse } from "axios";
const YTS_LIST_URL = "https://yts.mx/api/v2/list_movies,json";
const YTS_MOVIE_URL = "https://yts.mx/api/v2/movie_details.json";
const YTS_SUGGESTIONS_URL = "https://yts.mx/api/v2/movie_suggestions.json";
const list_movies = axios.create({
  baseURL: YTS_LIST_URL,
});
const movie_details = axios.create({
  baseURL: YTS_MOVIE_URL,
});
const suggestions = axios.create({
  baseURL: YTS_SUGGESTIONS_URL,
});

export { list_movies, movie_details ,suggestions, type AxiosResponse };
