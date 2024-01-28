import { readdirSync } from "fs"
import { resolve } from "path"
import { viteStaticCopy } from "vite-plugin-static-copy"

export default {
  css: {
    transformer: "lightningcss",
  },
  appType: "mpa",
  publicDir: false,
  build: {
      cssMinify: "lightningcss",
      lib: {
          entry: readdirSync("lib", {recursive: true}).map((file)=>
            resolve(`${__dirname}/lib`,file)
          ),
        fileName: (_, entryName) => {
            return `js/${entryName}.js`;
        },
          // NOTE: es is not supported minify, use cjs
          formats: ["cjs"],
      },
      outDir: "static",
  },
  plugins: [
   viteStaticCopy({
       targets: [{
          src: readdirSync("assets", {recursive: true}).map((file)=>
            resolve(`${__dirname}/assets`,file)
          ),
           dest: "assets"
       },
       ]
   })
  ]
}
