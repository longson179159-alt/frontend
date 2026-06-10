// https://nuxt.com/docs/api/configuration/nuxt-config
import process from "node:process";

export default defineNuxtConfig({

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/LangIcon-128.png' }
      ]
    }
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome"],

  // Runtime config values available on server (and `public` section also available on client).
runtimeConfig: {
  // Backend base URL used by server-side proxy.
  // Priority:
  // 1) NUXT_API_PROXY_BASE (server-only env)
  // 2) NUXT_PUBLIC_API_BASE (public env fallback)
  // 3) "http://localhost:8000" (local default fallback)
  apiProxyBase: process.env.NUXT_API_PROXY_BASE || process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",

  // Public runtime config: exposed to browser + server.
  public: {
    // Base URL used by frontend API calls.
    // If env not set, use internal proxy path "/api".
    // apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    apiBase: "/api",
  },
},


  fontawesome: {
    icons: {
      solid: [
        "chevron-down",
        "chevron-left",
        "chevron-right",
        "plus",
        "minus",
        "bars",
        "times",
        "search",
        "chevron-up",
        "play-circle",
        "pause-circle",
        "ellipsis-h",
        "ellipsis-v",
        "play",
        "check",
        "check-circle",
      ],
    },
  },
});
