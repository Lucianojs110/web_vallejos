import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import node from "@astrojs/node";

import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';


import { API_ENDPOINT } from './src/config/constants';

const customPagesPromise = new Promise((resolve, reject) => {
  const customPages = [];
  fetch(`${API_ENDPOINT}/api/v1/product/urls-site-maps`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.urls.forEach((slug) => {
        customPages.push(`https://test.vallejosmateriales.com.ar/catalogo/${slug}`);
      });
      resolve(customPages);
    })
    .catch((err) => {
      reject(err);
    });
});

const customPages = await customPagesPromise;

await fetch(`${API_ENDPOINT}/api/v1/groups`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
}).then((response) => response.json())
  .then((data) => {
    data.forEach((group) => {
      customPages.push(`https://test.vallejosmateriales.com.ar/categoria/${group.slug}`);
    });
  });

// https://astro.build/config
export default defineConfig({
  site: "https://test.vallejosmateriales.com.ar/",
  integrations: [react(), tailwind(), sitemap(
    {
      customPages,
    }
  ), robotsTxt({
    policy: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/checkout',
        crawlDelay: 2,
      },
    ],
  }),],
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
});