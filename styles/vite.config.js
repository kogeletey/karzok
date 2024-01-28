import { resolve } from "path"
import { splitVendorChunkPlugin } from 'vite'
import  Unfonts  from "unplugin-fonts/vite"

export default {
  css: {
    transformer: "lightningcss",
    lightningcss: {
        cssModules: true,
    },
  },
  build: {
    cssMinify: "lightningcss",
    lib: {
        entry: [resolve(__dirname, "index.js")],
        formats: ["es"]
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
    splitVendorChunkPlugin()
  ]
}
