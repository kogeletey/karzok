import { readdirSync } from "fs"
import { resolve } from "path"
import { viteStaticCopy } from "vite-plugin-static-copy"

export default {
  appType: "mpa",
  publicDir: false,
  build: {
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
       {
        src: readdirSync("../node_modules/@karzok/styles/dist", {recursive: true}).map((file)=>
            resolve("../node_modules/@karzok/styles/dist",file)
          ),
          dest: "."
       }]
   })
  ]
}
