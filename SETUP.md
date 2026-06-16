# サイトリポジトリ（public）セットアップ手順

`flyde-minecraft-bedrock-site` を GitHub に public リポジトリとして公開するための、初回セットアップ手順。

**前提**：ソース（このリポジトリ）は private、サイトリポジトリは public。`scripts/publish-all.js` がビルド後に
`gh release create` でサイトリポジトリへ無料版ベータzipを自動アップロードする（GitHub Actions は使わず、ローカルの `gh` CLI 経由）。

## 1. git 初期化

```bash
cd ../flyde-minecraft-bedrock-site
git init
git add README.md USAGE.md LICENSE.md .gitignore
git commit -m "docs: 初回公開"
```

`dist/` は置かない（ビルド済みJSは zip 化して GitHub Release にのみ含める。リポジトリ直下には置かない）。

## 2. GitHub に public リポジトリを作成

```bash
gh repo create Mming-Lab/flyde-minecraft-bedrock-site --public --source=. --remote=origin --push
```

すでに `gh repo create` 済みなら、リモート追加とpushだけでよい：

```bash
git remote add origin https://github.com/Mming-Lab/flyde-minecraft-bedrock-site.git
git push -u origin main
```

## 3. gh CLI のログイン確認（クロスリポジトリ Release 用）

`publish-all.js` はこのリポジトリ（private）から実行され、`gh release create ... --repo Mming-Lab/flyde-minecraft-bedrock-site` で
サイトリポジトリ（public）に Release を作成する。事前に `gh` が両リポジトリにアクセスできるアカウントでログイン済みである必要がある。

```bash
gh auth status
```

権限が無い／別アカウントの場合は `gh auth login` で再ログインする。

## 4. 動作確認

```bash
cd ../flyde-minecraft-bedrock
npm run publish:all
```

実行後、`https://github.com/Mming-Lab/flyde-minecraft-bedrock-site/releases` に
`flyde-minecraft-bedrock-free-beta-*.zip` が言語ごとにアップロードされていることを確認する。

## 補足：このファイル自体について

このガイドは `gh release create` によるクロスリポジトリ連携という内部の仕組みに触れているため、
このリポジトリ（private）側にのみ置く。サイトリポジトリ（public）には含めない。
