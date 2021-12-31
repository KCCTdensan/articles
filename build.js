const fs = require("fs")
const glob = require("tiny-glob")
const fm = require("front-matter")

const srcDir = "src"
const distDir = "dist/api"

;(async () => {

  { // blog
    const files = await glob(`${srcDir}/blog/**/*.md`)
    const data = { data: [], }
    files.forEach(file => {
      const content = fm(fs.readFileSync(file).toString())
      data.data.push({
        slug: content.attributes.slug || file.slice(`${srcDir}/blog/`.length, -3),
        date: content.attributes.date,
        body: content.body,
      })
    })
    fs.writeFileSync(`${distDir}/blog.json`, JSON.stringify(data))
  }

  { // news
    const files = await glob(`${srcDir}/news/**/*.md`)
    const data = { data: [], }
    files.forEach(file => {
      const content = fm(fs.readFileSync(file).toString())
      data.data.push({
        slug: content.attributes.slug || file.slice(`${srcDir}/blog/`.length, -3),
        date: content.attributes.date,
        body: content.body,
      })
    })
    fs.writeFileSync(`${distDir}/news.json`, JSON.stringify(data))
  }

})()
