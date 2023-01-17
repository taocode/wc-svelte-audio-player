import fs from 'fs'
import path from 'path'

try {
  const readme = fs.readFileSync(path.resolve(process.cwd(),'README.md'))
  const cleaned = readme.toString().replaceAll(/ \{#.*\}/g,'')
  const lines = cleaned.split("\n")
  lines.splice(0,4)
  console.log(`line count ${lines.length}`)
  console.log('Overwriting /src/README.md with clean copy')
  fs.writeFileSync(path.resolve(process.cwd()+'/src','README.md'),lines.join("\n").toString())
} catch (err) {
  console.error(err)
}