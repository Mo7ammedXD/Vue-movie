<template>
  <div class="d-md-flex d-md-none px-5 py-4">
    <v-card color="black" class="ma-auto">
      <v-img :src="moiveNow?.large_cover_image" class="object-fit-contain">
      </v-img>
      <v-card>
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="one">info</v-tab>
          <v-tab v-if="moiveNow?.yt_trailer_code" value="two">trailers</v-tab>
          <v-tab value="three" v-if="moiveNow?.description_full">about</v-tab>
        </v-tabs>

        <v-card-text class="bg-yellow-400">
          <v-window v-model="tab">
            <v-window-item value="one">
              <div class="d-flex align-center">
                <v-rating
                  :length="1"
                  :size="30"
                  color="white"
                  active-color="white"
                  model-value="1"
                  readonly
                ></v-rating>
                <p>{{ moiveNow?.rating }}</p>
              </div>
              <v-row class="ma-auto" >
                <v-chip
                size="small"
                class="ma-1 pa-2"
                variant="elevated"
                  v-for="(genre, index) in moiveNow?.genres"
                  :key="index"
                  :color="getOrderStatusColor(genre)"
                >
                  <p>{{ genre }}</p>
                </v-chip></v-row
              >
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
        <v-card color="black">
          <v-card-title  >Download</v-card-title>
          <v-card-subtitle >Torrent</v-card-subtitle>
          <v-row class="itmes">
            <div
              class="ma-2 mb-5"
              v-for="(torrent, index) in moiveNow?.torrents"
              :key="index"
            >
              <v-btn
                :href="torrent.url"
                color="primary"
                append-icon="mdi-download"
                ><h4>{{ torrent.type }}</h4>
                <h4>{{ torrent.quality }}</h4></v-btn
              >
            </div>
          </v-row>
        </v-card>
      </v-card>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/movie";
import { onMounted, ref } from "vue";
import type { Movie } from "@/types/Movie";
import { useRoute } from "vue-router";
import { getOrderStatusColor } from "@/helper/color";
let vueRouter = useRoute();
let appStore = useAppStore();
const tab = ref();
let moiveNow = ref<Movie>();
onMounted(async () => {
  moiveNow.value = await appStore.fetchMovie(
    Number.parseInt(vueRouter.params.id as string)
  );

});
</script>
<style scoped>
.itmes {
  display: flex;
  width: 100%;
  justify-content: space-around;

  padding: 10px;
  height: auto;
}
.item {
  min-width: 120px;
  max-width: 120px;
  margin-right: 10px;
}
.title {
  font-weight: bold;
  color: white;
  padding: 10px;
  height: 70px;
}

.object-fit-contain {
  object-fit: contain !important;
}
.bg-black {
  background-color: #00000067;
}
.position_absolute {
  position: relative;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #00000067;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  height: 100%;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  background-color: rgba(0, 0, 0, 0.5);
}
@media (min-width: 850px) {
}
.movieTitle {
  font-weight: 800;
  background: #00000000;
  height: 100%;
  box-shadow: inset 0px -20px 12px 0px #0000009c;
  position: relative;
  top: -42px;
}
.story {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  padding: 20px;

}
</style>
