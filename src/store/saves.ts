import { Movie } from '@/types/Movie'
import { defineStore } from 'pinia'

export const useSaveMovieStore = defineStore('hideAndShow', {
	state: () => ({
		settings: {
      movieToSave: <Movie[]>[]
		},
	}),
	actions: {
		updateMovieSettings(MovieSettings: Movie[]) {
			this.settings.movieToSave = MovieSettings
		},
	},
	persist: true,
})
