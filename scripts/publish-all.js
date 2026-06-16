#!/usr/bin/env node
'use strict'

/**
 * Publish npm packages + generate distribution zips for all locales.
 *
 *   npm run publish:all
 *
 * Per locale (both _maps/ and _i18n/ must exist):
 *   1. Switch locale         (set-lang.js)
 *   2. Build free version    → dist/index.free.flyde.js  → npm publish + releases/*free-beta*.zip
 *   3. Build full version    → dist/index.flyde.js       → releases/*full*.zip
 * After all locales:
 *   4. Upload free-beta zips → GitHub Release on the public site repo
 *
 * npm packages:
 *   ja_JP → flyde-minecraft-bedrock          (default, no suffix)
 *   en_US → flyde-minecraft-bedrock-en-us
 *
 * zip files:
 *   releases/flyde-minecraft-bedrock-full-ja-jp-v{version}.zip
 *   releases/flyde-minecraft-bedrock-free-beta-ja-jp-v{version}.zip
 *
 * full zip contents (complete project template, no source files):
 *   flyde-minecraft-bedrock/
 *     package.json         dependencies only, flyde.exposes → dist/
 *     dist/
 *       index.flyde.js     full compiled nodes
 *     flows/
 *       *.flyde            sample flows
 *     flyde-mc.config.json  default log level (INFO)
 *
 * free-beta zip contents (same shape, free nodes only, no sample flows yet):
 *   flyde-minecraft-bedrock/
 *     package.json         dependencies only, flyde.exposes → dist/
 *     dist/
 *       index.free.flyde.js
 *     flyde-mc.config.json  default log level (INFO)
 *
 * The free-beta zips are published to the public site repo via `gh release create`
 * (npm publish isn't live yet during the beta phase, so the zip is the install path).
 */

const fs       = require('fs')
const path     = require('path')
const cp       = require('child_process')
const { ZipArchive } = require('archiver')

const ROOT         = path.join(__dirname, '..')
const PKG_PATH     = path.join(ROOT, 'package.json')
const MAPS_DIR     = path.join(ROOT, '_nodes/utils/_maps')
const I18N_DIR     = path.join(ROOT, '_nodes/_i18n')
const RELEASES_DIR = path.join(ROOT, 'releases')

const DEFAULT_LOCALE = 'ja_JP'
const FREE_ENTRY     = 'dist/index.free.flyde.js'
const FULL_ENTRY     = 'dist/index.flyde.js'
const SITE_REPO      = 'Mming-Lab/flyde-minecraft-bedrock-site'

// Collect locales present in both _maps/ and _i18n/
function collectLocales() {
  const inMaps = new Set(
    fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
  )
  const inI18n = new Set(
    fs.readdirSync(I18N_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
  )
  return [...inMaps]
    .filter(loc => inI18n.has(loc))
    .sort((a, b) => {
      if (a === DEFAULT_LOCALE) return -1  // default locale first
      if (b === DEFAULT_LOCALE) return  1
      return a.localeCompare(b)
    })
    .map(locale => ({
      locale,
      localeSlug : locale.toLowerCase().replace('_', '-'),
      nameSuffix : locale === DEFAULT_LOCALE ? '' : `-${locale.toLowerCase().replace('_', '-')}`,
    }))
}

function run(cmd) {
  cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
}

// Create zip: complete project template with full compiled nodes
function createZip(localeSlug, nameSuffix, version) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(RELEASES_DIR, { recursive: true })

    const zipName = `flyde-minecraft-bedrock-full-${localeSlug}-v${version}.zip`
    const zipPath = path.join(RELEASES_DIR, zipName)
    const DIR     = 'flyde-minecraft-bedrock'  // directory name inside the zip

    // package.json for the zip (project template, not npm package)
    const origPkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'))
    const zipPkg  = {
      name        : `flyde-minecraft-bedrock${nameSuffix}`,
      version,
      private     : true,
      description : origPkg.description,
      flyde       : { exposes: [FULL_ENTRY] },
      dependencies: origPkg.peerDependencies,
    }

    const output  = fs.createWriteStream(zipPath)
    const archive = new ZipArchive({ zlib: { level: 6 } })

    output.on('close', () => {
      const kb = (archive.pointer() / 1024).toFixed(1)
      console.log(`✓ releases/${zipName}  (${kb} KB)`)
      resolve()
    })
    archive.on('error', reject)
    archive.pipe(output)

    // package.json
    archive.append(JSON.stringify(zipPkg, null, 2) + '\n', { name: `${DIR}/package.json` })

    // dist/index.flyde.js (full compiled)
    archive.file(path.join(ROOT, FULL_ENTRY), { name: `${DIR}/${FULL_ENTRY}` })

    // flows/*.flyde
    fs.readdirSync(path.join(ROOT, 'flows'))
      .filter(f => f.endsWith('.flyde'))
      .forEach(f => archive.file(path.join(ROOT, 'flows', f), { name: `${DIR}/flows/${f}` }))

    // flyde-mc.config.json (INFO level for distribution)
    archive.append(JSON.stringify({ logLevel: 'INFO' }, null, 2) + '\n', { name: `${DIR}/flyde-mc.config.json` })

    // LICENSE-COMMERCIAL.md
    archive.file(path.join(ROOT, 'LICENSE-COMMERCIAL.md'), { name: `${DIR}/LICENSE.md` })

    archive.finalize()
  })
}

// Create zip: free-beta project template (free compiled nodes only)
function createFreeZip(localeSlug, nameSuffix, version) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(RELEASES_DIR, { recursive: true })

    const zipName = `flyde-minecraft-bedrock-free-beta-${localeSlug}-v${version}.zip`
    const zipPath = path.join(RELEASES_DIR, zipName)
    const DIR     = 'flyde-minecraft-bedrock'

    const origPkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'))
    const zipPkg  = {
      name        : `flyde-minecraft-bedrock${nameSuffix}`,
      version,
      private     : true,
      description : origPkg.description,
      flyde       : { exposes: [FREE_ENTRY] },
      dependencies: origPkg.peerDependencies,
    }

    const output  = fs.createWriteStream(zipPath)
    const archive = new ZipArchive({ zlib: { level: 6 } })

    output.on('close', () => {
      const kb = (archive.pointer() / 1024).toFixed(1)
      console.log(`✓ releases/${zipName}  (${kb} KB)`)
      resolve(zipPath)
    })
    archive.on('error', reject)
    archive.pipe(output)

    // package.json
    archive.append(JSON.stringify(zipPkg, null, 2) + '\n', { name: `${DIR}/package.json` })

    // dist/index.free.flyde.js
    archive.file(path.join(ROOT, FREE_ENTRY), { name: `${DIR}/${FREE_ENTRY}` })

    // flyde-mc.config.json (INFO level for distribution)
    archive.append(JSON.stringify({ logLevel: 'INFO' }, null, 2) + '\n', { name: `${DIR}/flyde-mc.config.json` })

    // LICENSE.md (PolyForm Noncommercial — same as npm free version)
    archive.file(path.join(ROOT, 'LICENSE.md'), { name: `${DIR}/LICENSE.md` })

    archive.finalize()
  })
}

// Upload free-beta zips to the public site repo as a single GitHub Release
function uploadFreeRelease(version, zipPaths) {
  const assets = zipPaths.map(p => `"${p}"`).join(' ')
  run(`gh release create v${version} ${assets} --repo ${SITE_REPO} --title "v${version} (beta)" --notes "Free beta build"`)
}

async function main() {
  const langs       = collectLocales()
  const origPkgText = fs.readFileSync(PKG_PATH, 'utf8')
  const origPkg     = JSON.parse(origPkgText)
  const baseName    = origPkg.name
  const version     = origPkg.version

  console.log('Target locales:')
  langs.forEach(({ locale, localeSlug, nameSuffix }) => {
    console.log(`  ${locale.padEnd(8)} → npm: ${baseName + nameSuffix}  /  zip: flyde-minecraft-bedrock-full-${localeSlug}-v${version}.zip`)
  })
  console.log()

  let failed = false
  const freeZipPaths = []

  try {
    for (const { locale, localeSlug, nameSuffix } of langs) {
      console.log(`\n${'='.repeat(50)}`)
      console.log(`  ${locale}  (${baseName + nameSuffix})`)
      console.log('='.repeat(50))

      // 1. switch locale
      run(`node scripts/set-lang.js ${locale}`)

      // 2. build free version → npm publish + free-beta zip
      run('node scripts/build.js')
      const pkg  = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'))
      pkg.name    = baseName + nameSuffix
      pkg.main    = `./${FREE_ENTRY}`
      pkg.exports = { '.': `./${FREE_ENTRY}` }
      pkg.flyde   = { exposes: [FREE_ENTRY] }
      pkg.files   = ['dist/index.free.flyde.js']
      fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf8')

      try {
        run('npm publish --access public')
        console.log(`\n✓ npm published: ${baseName + nameSuffix}`)
      } catch (err) {
        console.error(`\n✗ npm publish failed: ${baseName + nameSuffix}`)
        console.error(err.message)
        failed = true
      }

      freeZipPaths.push(await createFreeZip(localeSlug, nameSuffix, version))

      // 3. build full version → zip
      fs.writeFileSync(PKG_PATH, origPkgText, 'utf8')  // restore before full build
      run('node scripts/build.js --full')
      await createZip(localeSlug, nameSuffix, version)
    }

    // 4. upload free-beta zips to the public site repo
    try {
      uploadFreeRelease(version, freeZipPaths)
      console.log(`\n✓ uploaded free-beta zips to ${SITE_REPO} (v${version})`)
    } catch (err) {
      console.error(`\n✗ gh release upload failed (repo may not exist yet, or release v${version} already exists)`)
      console.error(err.message)
    }
  } finally {
    // restore to default locale and original package.json
    console.log(`\n${'='.repeat(50)}`)
    console.log(`  Restoring: ${DEFAULT_LOCALE} + original package.json`)
    console.log('='.repeat(50))
    run(`node scripts/set-lang.js ${DEFAULT_LOCALE}`)
    fs.writeFileSync(PKG_PATH, origPkgText, 'utf8')
    console.log('✓ Done.')
  }

  process.exit(failed ? 1 : 0)
}

main()
