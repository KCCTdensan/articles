const fs = require("fs").promises
const glob = require("tiny-glob")
const fm = require("front-matter")
const { marked } = require("marked")

const srcDir = "src"
const assetDir = "assets"
const distDir = "dist/api"
const assetDistDir = "dist/assets"

;(async()=>{

  try { // prepare
    await fs.stat(distDir)
      .catch(()=>fs.mkdir(distDir))
    await fs.stat(assetDistDir)
      .catch(()=>fs.mkdir(assetDistDir))
  } catch(e) {
    console.error("Error occured in prepare phase")
    console.error(e)
  }

  try { // MD
    async function proc(srcDir, distFile) {
      const files = await glob(`${srcDir}/**/*.md`)
      const data = { data: [], }
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
      data.data.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime())
      fs.writeFile(distFile, JSON.stringify(data))
    }

    (await glob(`${srcDir}/*`)).forEach(async path => {
      if((await fs.stat(path)).isDirectory()) {
        proc(path, `${distDir}/${path.slice(`${srcDir}/`.length)}.json`)
      }
    })
  } catch(e) {
    console.error("Error occured in MD phase")
    console.error(e)
  }

  try { // assets
    const files = await glob(`${assetDir}/**/*`)
    const data = { data: [], }
    files.forEach(async path => {
      const pathRel = path.slice(`${assetDir}/`.length)
      if((await fs.stat(path)).isDirectory())
        await fs.mkdir(`${assetDistDir}/${pathRel}`)
      else
        await fs.copyFile(path, `${assetDistDir}/${pathRel}`)
    })
  } catch(e) {
    console.error("Error occured in assets phase")
    console.error(e)
  }

})()
