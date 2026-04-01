import svgToDataUri from "mini-svg-data-uri";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
	],
	future: { hoverOnlyWhenSupported: true },
	plugins: [],
	darkMode: "class",
	theme: {
		extend: {
colors: {
	candyPink: {
		50: "#fff0f7",
		100: "#ffd6ea",
		200: "#ffadd5",
		300: "#ff85c0",
		400: "#ff5cab",
		500: "#ff4fa3",
		600: "#e63b8d",
		700: "#bf2b73",
		800: "#991f5a",
		900: "#66133c",
	},

	candyOrange: {
		50: "#fff4ea",
		100: "#ffe2c7",
		200: "#ffd0a6",
		300: "#ffb878",
		400: "#ffa859",
		500: "#ff9f43",
		600: "#e6862f",
		700: "#bf6c23",
		800: "#99501a",
		900: "#663411",
	},

	candyYellow: {
		50: "#fffde6",
		100: "#fff8b3",
		200: "#fff280",
		300: "#ffec66",
		400: "#ffe95a",
		500: "#ffe44d",
		600: "#e6cc2e",
		700: "#bfa71f",
		800: "#807014",
		900: "#4d420a",
	},

	candyBlue: {
		50: "#e9faff",
		100: "#c7f0fb",
		200: "#a3e6f7",
		300: "#79daf3",
		400: "#5ed2f1",
		500: "#4cc9f0",
		600: "#33b3d6",
		700: "#268fad",
		800: "#1a6b82",
		900: "#0f404f",
	},

	candyGreen: {
		50: "#e8faec",
		100: "#c7f2d1",
		200: "#a3eab5",
		300: "#74df90",
		400: "#5fd877",
		500: "#4cd964",
		600: "#34bf4d",
		700: "#28993d",
		800: "#1c702c",
		900: "#11441a",
	},
},
			spacing: {
				"no-header": "calc(100dvh - 3.5rem)",
				screen: "100dvh",
			},
			screens: {
				"3xs": "320px",
				"2xs": "375px",
				xs: "425px",
			},
		},
		fontFamily: {
			body: [
				"Inter",
				"ui-sans-serif",
				"system-ui",
				"-apple-system",
				"system-ui",
				"Segoe UI",
				"Roboto",
				"Helvetica Neue",
				"Arial",
				"Noto Sans",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji",
			],
			sans: [
				"Inter",
				"ui-sans-serif",
				"system-ui",
				"-apple-system",
				"system-ui",
				"Segoe UI",
				"Roboto",
				"Helvetica Neue",
				"Arial",
				"Noto Sans",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji",
			],
		},
		backgroundImage: (theme) => ({
			"multiselect-caret": `url("${svgToDataUri(
				`<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>`
			)}")`,
			"multiselect-spinner": `url("${svgToDataUri(
				`<svg viewBox="0 0 512 512" fill="${theme(
					"colors.primary.500"
				)}" xmlns="http://www.w3.org/2000/svg"><path d="M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z"></path></svg>`
			)}")`,
			"multiselect-remove": `url("${svgToDataUri(
				`<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>`
			)}")`,
			"gradient-to-r": `linear-gradient(to right, var(--tw-gradient-stops))`,
		}),
	},
};
