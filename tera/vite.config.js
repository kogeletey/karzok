import { readdirSync } from "fs"
import { resolve } from "path"

export default {
  publicDir: false,
  target: ["esnext"],
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
  }
}
