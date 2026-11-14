import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://conectarnaturaleza.netlify.app",
	integrations: [
		react(),
		sitemap(),
		compress({
			HTML: false, // minifying the HTML strips whitespace text nodes React expects when it hydrates the islands
			JavaScript: true,
			CSS: false,
			Image: false, // astro:assets handles this. Enabling this can dramatically increase build times
			SVG: false,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
				build: {
			assetsInlineLimit: 0,
		},
	},
});
