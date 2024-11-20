// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';
import { cities } from './data/cities';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  site: {
    url: 'https://safer-times.net',
    name: 'אזעקות לפי זמנים'
  },
  css: [
    'primeflex/primeflex.css',
    // other global styles if any
  ],
  modules: [
    '@primevue/nuxt-module',
    'nuxt-gtag',
    '@nuxt/icon',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap'
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  gtag: {
    id: 'G-W3G93EXEL4'
  },
  sitemap: {
    urls: () => {
      const urls = [];
      for (const city of cities) {
        urls.push(`/?cities=${city}`);
      }
      return urls;
    }
  }
})