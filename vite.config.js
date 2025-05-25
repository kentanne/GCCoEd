import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //       https: {
  //           key: fs.readFileSync('./localhost-key.pem'),
  //           cert: fs.readFileSync('./localhost.pem'),
  //       },
  //       host: 'localhost',
  //       port: 5174,
  //   },
});
