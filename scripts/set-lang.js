#!/usr/bin/env node
'use strict'

/**
 * 言語切替スクリプト
 *   npm run lang:ja  → 日本語
 *   npm run lang:en  → 英語
 *
 * _nodes/index.flyde.ts の i18n import 行だけを書き換える。
 * VSCode ウィンドウのリロードで Flyde メニューに反映される。
 */

const fs   = require('fs')
const path = require('path')

const lang = process.argv[2]
if (lang !== 'ja' && lang !== 'en') {
  console.error('Usage: node set-lang.js <ja|en>')
  process.exit(1)
}

const entryPath = path.join(__dirname, '../_nodes/index.flyde.ts')
const content   = fs.readFileSync(entryPath, 'utf8')

const from = lang === 'en' ? 'ja_JP' : 'en_US'
const to   = lang === 'en' ? 'en_US' : 'ja_JP'
const next = content.replace(
  `import i18n from './_i18n/${from}.json'`,
  `import i18n from './_i18n/${to}.json'`,
)

if (next === content) {
  console.log(`既に ${lang === 'en' ? 'English' : '日本語'} です。`)
  process.exit(0)
}

fs.writeFileSync(entryPath, next, 'utf8')
console.log(`✓ _nodes/index.flyde.ts → ${lang === 'en' ? 'English' : '日本語'}`)
console.log('VSCode ウィンドウをリロードしてください（Ctrl+Shift+P → "Reload Window"）。')
