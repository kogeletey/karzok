import { build } from "npm:esbuild"
import { resolve,globToRegExp,join } from "https://deno.land/std/path/mod.ts"

const fileNames: string[] = []

for await (const files of ["islands","common"]){
    for await (const dirEntry of Deno.readDir(files)){
        if (dirEntry.isFile) {
          fileNames.push(join(files,dirEntry.name));
        }
    }
}

let esbld = await build({
        entryPoints: fileNames,
        outdir: "pre-build",
        bundle: false,
        minify: true,
})

if (esbld.errors.length != 0) {
    console.log(esbld.errors)
}

