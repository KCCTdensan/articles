import fs from "node:fs/promises"
import glob from "tiny-glob"
import fm from "front-matter"
import { marked } from "marked"

const srcDir = "src"
const assetDir = "assets"
const distDir = "dist/api"
const assetDistDir = "dist/assets"

// prepare

await Promise.allSettled([
  fs.rm(distDir, { recursive: true }),
  fs.rm(assetDistDir, { recursive: true }),
])

await Promise.allSettled([
  fs.mkdir(distDir, { recursive: true }),
  fs.mkdir(assetDistDir, { recursive: true }),
])

// markdown

async function proc(srcDir, distFile) {
  const files = await glob(`${srcDir}/**/*.md`)
  const data = { data: [] }
  await Promise.all(
    files.map(async path => {
      const content = fm((await fs.readFile(path)).toString())
      data.data.push({
        slug: content.attributes.slug || path.slice(`${srcDir}/`.length, -3),
        title: content.attributes.title,
        description: content.attributes.description,
        author: content.attributes.author,
        noRobots: content.attributes.noRobots,
        noTitleFormat: content.attributes.noTitleFormat,
        date: content.attributes.date,
        dateUpd: content.attributes.dateUpd,
        showMeta: content.attributes.showMeta,
        body: marked.parse(content.body),
      })
    })
  )
  data.data.sort((a, b) => new Date(b.date) - new Date(a.date))
  await fs.writeFile(distFile, JSON.stringify(data))
}

for (const path of await glob(`${srcDir}/*`))
  if ((await fs.stat(path)).isDirectory())
    proc(path, `${distDir}/${path.slice(`${srcDir}/`.length)}.json`)

// assets

for (const path of await glob(`${assetDir}/**/*`)) {
  const pathRel = path.slice(`${assetDir}/`.length)
  if ((await fs.stat(path)).isDirectory())
    await fs.mkdir(`${assetDistDir}/${pathRel}`)
  else await fs.copyFile(path, `${assetDistDir}/${pathRel}`)
}
