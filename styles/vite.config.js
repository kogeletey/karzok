import { resolve } from "path"
import  Unfonts  from "unplugin-fonts/vite"

export default {
  css: {
    transformer: "lightningcss",
  },
  build: {
    cssMinify: "lightningcss",
    lib: {
        entry: resolve(__dirname,"index.js"),
        formats: ["es"],
    }
  },
  plugins: [
    Unfonts({
      fontsource: {
          families: [
            "Inter",
            "Jetbrains Mono"
      ]}
    }),
  ]
}
