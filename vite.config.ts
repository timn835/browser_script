import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			input: {
				popup: "/popup.html",
				background: "src/background/background.ts",
				contentScript: "src/contentScript/contentScript.ts",
			},
			output: {
				entryFileNames: (chunk) => {
					// Put background and content scripts at top level (not in assets/)
					if (
						chunk.name === "background" ||
						chunk.name === "contentScript"
					) {
						return "[name].js";
					}
					return "assets/[name]-[hash].js";
				},
			},
		},
	},
});
