import { defineConfig } from "vite"

// vite.config.js
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				index: "./index.html",
				interactive: "./interactive/index.html",
			},
		},
		target: ["safari15", "chrome89", "edge89", "es2022", "firefox89"],
	},
	base: "/Aardvark-Site/"
});
