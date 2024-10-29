<template>
  <v-app-bar class="bg-black safe-area-top">
    <v-toolbar-title v-once>
      <span class="text-yellow">XD</span>MOVIE
    </v-toolbar-title>

    <template v-if="isMobile">
      <v-spacer></v-spacer>
      <v-btn @click="toggleDrawer" icon>
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn
        v-for="item in navItems"
        :key="item.name"
        :class="getButtonClass(item)"
        :to="item.route"
        flat
        class="ma-2"
      >
        <v-icon left>{{ item.icon }}</v-icon>
        {{ $t(`navbar.${item.name}`) }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="toggleDrawer" icon>
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>
  </v-app-bar>

  <div class="main-content safe-area-bottom">
  </div>

  <v-bottom-navigation
    v-if="isMobile"
    class="bg-black safe-area-bottom"
    grow
    hide-on-scroll
  >
    <v-btn
      v-for="item in navItems"
      :key="item.name"
      :to="item.route"
      icon
      :class="getButtonClass(item)"
    >
      <v-icon :size="iconSize">{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>

  <v-navigation-drawer v-model="drawer" app right>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('select_language') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLocale(lang.code)"
        :class="{ 'bg-yellow': currentLocale === lang.code }"
      >
        {{ lang.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useNavItems } from '@/helper/navBar';
import { useI18n } from 'vue-i18n';
import i18n from '@/helper/i18n';
import { SafeArea } from '@capacitor-community/safe-area';
import { Capacitor } from '@capacitor/core';

type Locale = 'en' | 'ar';

const { navItems } = useNavItems();
const { width } = useDisplay();

const { locale } = useI18n();
const currentLocale = computed(() => locale.value);

const drawer = ref(false);

const isMobile = computed(() => width.value < 600);

type Language = { code: Locale; name: string };

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

onMounted(async () => {
  const storedLang = localStorage.getItem('locale');
  const lang: Locale = storedLang === 'en' || storedLang === 'ar' ? storedLang : 'en';
  changeLocale(lang);

  if (Capacitor.getPlatform() === 'android') {
    SafeArea.disable({
      config: {
        customColorsForSystemBars: true,
        statusBarColor: '#00000000', 
        statusBarContent: 'light',
        navigationBarColor: '#00000000', 
        navigationBarContent: 'dark',
      },
    });
  }
});

const changeLocale = async (lang: Locale) => {
  if (!i18n.global.availableLocales.includes(lang)) {
    await loadLocaleMessages(lang);
  }
  locale.value = lang;
  localStorage.setItem('locale', lang);
};

const loadLocaleMessages = async (lang: Locale) => {
  const messages = await import(`@/locales/${lang}.json`);
  i18n.global.setLocaleMessage(lang, messages.default);
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const getButtonClass = (item: any) => {
  return {
    'bg-yellow text-black': item.isActive(),
    'text-white': !item.isActive(),
  };
};

const iconSize = '28px';
</script>

<style>
.bg-yellow {
  background-color: #ffeb3b !important;
}
.text-black {
  color: #000 !important;
}
.text-white {
  color: #fff !important;
}

.safe-area-top {
  margin-top: env(safe-area-inset-top, var(--safe-area-inset-top, 0px));
}

.safe-area-bottom {
  margin-bottom: env(safe-area-inset-bottom, var(--safe-area-inset-bottom, 0px));
}
</style>
