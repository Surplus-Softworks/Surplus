import fs from "fs"
import { obfuscate } from "js-confuser"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import crx3 from "crx3"

console.error = () => {};

const execPromise = promisify(exec)

async function clear() {
  const prodDir = 'prod'
  try {
    if (fs.existsSync(prodDir)) {
      fs.rmSync(prodDir, { recursive: true, force: true })
    }
  } catch (err) {
    console.error("Error clearing the directory:", err)
  }
}

async function copyExtension() {
  await execPromise('xcopy /E /I extension prod\\extension\\')
}

async function bundleJS() {
  await execPromise('webpack --config webpack.config.js')
  const inputFilePath = 'prod/extension/main.js'
  const outputFilePath = 'prod/extension/main.js'
  const code = fs.readFileSync(inputFilePath, 'utf-8')

  const result = await obfuscate(code, {
    target: 'browser',
    compact: true,
    hexadecimalNumbers: true,
    deadCode: 1,
    identifierGenerator: 'zeroWidth',
    minify: true,
    movedDeclarations: true,
    renameVariables: true,
    stringConcealing: true,
    astScrambler: true,
    preserveFunctionLength: true,
    renameLabels: true,
    objectExtraction: true,
    variableMasking: true,
    lock: {
      integrity: true,
      selfDefending: true,
      tamperProtection: true,
      countermeasures: '',
    },
    dispatcher: 1,
    shuffle: true,
    globalConcealing: true,
    renameGlobals: true,
    calculator: true,
    opaquePredicates: 1,
    stringEncoding: true,
    stringSplitting: true,
    stringCompression: true,
    duplicateLiteralsRemoval: true,
    flatten: true,
    pack: true,
  })
  fs.writeFileSync(outputFilePath, `(function() { ${result.code} })();`)
}

async function packageCRX() {
  const extensionDir = path.resolve('prod/extension')
  const crxOutputPath = path.resolve('prod/Surplus.crx')

  crx3([extensionDir], {
    keyPath:null,
    crxPath: crxOutputPath,
  }).then(()=>{
    fs.renameSync(crxOutputPath, 'prod/Surplus.zip');
  })

  
}

async function build() {
  try {
    await clear()
    await copyExtension()
    await bundleJS()
    await packageCRX()
    console.log('Built!')
  } catch {}
}

build()