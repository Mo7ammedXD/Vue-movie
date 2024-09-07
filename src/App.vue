<template>
  <router-view />
</template>

<script setup lang="ts">
import { useLocale } from 'vuetify';
import { useI18n } from "vue-i18n";
import { onMounted, watch } from 'vue';  
import { on } from 'events';

const { current } = useLocale();
const { locale } = useI18n();
onMounted(() => {
  const lang = localStorage.getItem('locale') || 'en';
  current.value = lang;
});

watch(locale, () => {
  current.value = locale.value;  
});

</script>
