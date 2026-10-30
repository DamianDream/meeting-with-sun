// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://batalshikov.com',
  base: '/meeting-with-sun',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en', 'ua'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
