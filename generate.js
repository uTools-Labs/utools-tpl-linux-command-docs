const fs = require('fs')
const path = require('path')
const { marked } = require('marked')
const hljs = require('highlight.js')
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

const gitDownloadLinuxCommandDir = path.join(__dirname, 'linux-command')

const dataJsonPath = path.join(gitDownloadLinuxCommandDir, 'dist', 'data.json')

const linuxCommandData = JSON.parse(fs.readFileSync(dataJsonPath, { encoding: 'utf-8' }))

const indexes = Object.values(linuxCommandData).map(x => ({ t: x.n, p: x.p.replace('/', ''), d: x.d }))

indexes.forEach(item => {
  const markdownContent = fs.readFileSync(path.join(gitDownloadLinuxCommandDir, 'command', item.p + '.md'), { encoding: 'utf-8' })
  const html = `<!DOCTYPE html><html lang="zh_CN"><head><meta charset="UTF-8"><title></title><link rel="stylesheet" href="doc.css" /></head>
  <body><div class="markdown-body">${marked(markdownContent)}</div></body></html>`
  fs.writeFileSync(path.join(__dirname, 'public', 'command', item.p + '.html'), html)
  item.p = 'command/' + item.p + '.html'
})

fs.writeFileSync(path.join(__dirname, 'public', 'indexes.json'), JSON.stringify(indexes))
