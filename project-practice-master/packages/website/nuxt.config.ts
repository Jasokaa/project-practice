import packageJSON from "../../package.json";

const isDev = process.env.NUXT_PUBLIC_APP_ENV === "dev";

const name = "Jellylicious";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: true,

	modules: [
		"@nuxtjs/robots",
		"@nuxtjs/tailwindcss",
		"nuxt-svgo",
		"@pinia/nuxt",
		"@nuxt/image",
		"nuxt-swiper",
		"@nuxtjs/sitemap",
	],

	runtimeConfig: {
		public: {
			APP_VERSION: packageJSON.version,
			APP_ENV:
				process.env.NUXT_PUBLIC_APP_ENV ||
				("production" as "production" | "staging" | "dev"),
			STORE_NAME: name,
			STORE_LOCATION: {
				town: "Kyiv",
				region: "Ukraine",
				region_given: "Ukraine",
			},
			CONTACT: {
				phone: "+380000000000",
				telegram: "@jellylicious",
				facebook: "https://facebook.com",
				whatsapp: "+380000000000",
			},
			APP_URL: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
		},
	},

	nitro: {
		// preset: "node-server",
		// devProxy: {
		// 	host: "localhost",
		// },
		prerender: {
			routes: ["/prerender-images"],
		},
		esbuild: {
			options: {
				target: "esnext",
			},
		},
	},

	build: {
		transpile: ["trpc-nuxt"],
	},

	compatibilityDate: "2025-11-09",
	devtools: { enabled: false },
	css: ["~/assets/css/main.css"],

	pinia: {
		storesDirs: ["./app/stores/**"],
	},

	svgo: {
		defaultImport: "component",
	},

	vite: {
		server: {
			cors: {
				preflightContinue: true,
			},
		},
		resolve: {
			alias: {
				".prisma/client/index-browser":
					"prismaclient/generated/index-browser.js",
			},
		},
		optimizeDeps: {
			exclude: ["better-sqlite3"],
		},
	},

	sourcemap: {
		server: isDev,
		client: isDev,
	},

	image: {
		quality: 50,
		format: ["avif", "webp", "png"],
	},

	app: {
		head: { htmlAttrs: { lang: "uk" } },
	},

	site: {
		indexable: true,
		url: process.env.NUXT_PUBLIC_APP_URL,
		name,
	},
	sitemap: {
		sources: [`${process.env.NUXT_PUBLIC_APP_URL}/sitemap.xml`],
	},
});
