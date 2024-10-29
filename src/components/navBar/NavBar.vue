<template>
  <v-footer class="bg-black" v-if="isMobile">
    <v-bottom-navigation class="bg-black" grow>
      <v-btn
        v-for="item in navItems"
        :key="item.name"
        :class="{ 'bg-yellow': item.isActive() }"
        :to="item.route"
        icon
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>

      <v-btn @click="drawer = true" icon>
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>

  <v-app-bar class="bg-black" v-else>
    <v-toolbar-title>
      <span class="text-yellow">XD</span>MOVIE
    </v-toolbar-title>

    <v-btn
      v-for="item in navItems"
      :key="item.name"
      :class="{ 'bg-yellow': item.isActive() }"
      :to="item.route"
      flat  
    >
      <v-icon left>{{ item.icon }}</v-icon> 
      {{ $t(`navbar.${item.name}`) }} 
    </v-btn>
<v-spacer></v-spacer>

    <v-btn @click="()=> drawer = !drawer" icon>
      <v-icon>mdi-translate</v-icon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app right>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ $t('select_language') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="changeLocale('en')" :class="{ 'bg-yellow': currentLocale === 'en' }">
        English
      </v-list-item>
      <v-list-item @click="changeLocale('ar')" :class="{ 'bg-yellow': currentLocale === 'ar' }">
        العربية
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useNavItems } from '@/helper/navBar';
import { useI18n } from 'vue-i18n';

const navItems = useNavItems().navItems;
const display = useDisplay();

const { locale } = useI18n();
const currentLocale = computed(() => locale.value);

const drawer = ref(false);

onMounted(() => {
  const lang = localStorage.getItem('locale') || 'en';
  changeLocale(lang);
});

const changeLocale = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('locale', lang);
};

const isMobile = computed(() => display.width.value < 600);
</script>
