const fs = require("fs")
const glob = require("tiny-glob")
const fm = require("front-matter")

async function proc(srcDir, distFile) {
  const files = await glob(`${srcDir}/**/*.md`)
  const data = { data: [], }
  files.forEach(file => {
    const content = fm(fs.readFileSync(file).toString())
    data.data.push({
      slug:     content.attributes.slug || file.slice(`${srcDir}/`.length, -3),
      title:    content.attributes.title,
      description: content.attributes.description,
      author:   content.attributes.author,
      noRobots: content.attributes.noRobots,
      date:     content.attributes.date,
      dateUpd:  content.attributes.dateUpd,
      body:     content.body,
    })
  })
  fs.writeFileSync(distFile, JSON.stringify(data))
}

const srcDir = "src"
const distDir = "dist/api"

proc(`${srcDir}/blog`, `${distDir}/blog.json`)
proc(`${srcDir}/news`, `${distDir}/news.json`)
