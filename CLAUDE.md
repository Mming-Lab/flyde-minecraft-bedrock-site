# CLAUDE.md

## プロジェクト概要

Minecraft Education Edition をビジュアルフロープログラミングで操作する教室用ツール。  
子どもたちが Flyde のノードをワイヤーで繋ぐだけで Minecraft と連携できる。

パッケージ名：`flyde-minecraft-bedrock`

| パッケージ | 役割 |
|---|---|
| `socket-be` | Minecraft WebSocket 通信 |
| `@minecraft/vanilla-data` | ブロック・エンティティ名の enum |
| `@flyde/core` | Flyde の CodeNode 型定義・ランタイム |

---

## ディレクトリ構成

```
flyde-minecraft-bedrock/
├── CLAUDE.md
├── LICENSE.md                 ← Prosperity Public License 3.0.0（無料版zip用）
├── LICENSE-COMMERCIAL.md      ← 商用ライセンス（フル版zip用・zip に同梱）
├── package.json
├── tsconfig.json              ← "types": ["node"] が必須
├── flyde-mc.config.json        ← ログレベル設定（git 管理対象）
├── _nodes/
│   ├── index.flyde.ts         ← 全ノード（フル版）兼 Flyde エディタ用エントリ
│   ├── index.free.flyde.ts    ← 個人向け無料版（絞ったノードのみ）
│   ├── _factory.ts            ← localizeNode()：_core ノード + _i18n → 言語別ノード生成
│   ├── context-manager.ts     ← McContext シングルトン（内部用）
│   ├── ws-server.ts           ← WebSocket サーバーシングルトン（内部用）
│   ├── diag.ts                ← ファイルロガー（内部用）
│   ├── enum-utils.ts          ← _core/enum-utils の再エクスポート（後方互換ラッパー）
│   ├── _core/                 ← 処理ロジック（英語ポート名・言語非依存）
│   │   ├── connection.ts      ← 接続系
│   │   ├── agents.ts          ← エージェント系
│   │   ├── scoreboard.ts      ← スコアボード系
│   │   ├── enum-utils.ts      ← イベント数値→文字列変換ユーティリティ（内部用）
│   │   ├── events/
│   │   │   ├── player.ts
│   │   │   ├── block.ts
│   │   │   ├── item.ts
│   │   │   └── mob.ts
│   │   ├── commands/
│   │   │   ├── gameplay.ts    ← コマンド実行・時刻・天気・エリア塗りつぶし等
│   │   │   └── player.ts      ← 座標・タグ・レベル・ゲームモード等
│   │   └── utils/
│   │       ├── info.ts        ← スナップショット情報取得系
│   │       ├── selectors.ts   ← ID・イベント値選択系
│   │       ├── converters.ts  ← ロケール名変換系
│   │       └── math.ts        ← 座標・ベクトル演算系
│   ├── _i18n/                 ← ノード UI 翻訳（displayName・ポート名・select ラベル）
│   │   ├── ja_JP.json
│   │   ├── en_US.json
│   │   └── (追加予定 ...)
│   └── utils/
│       ├── _catalog.ts        ← ブロック/アイテム/モブのカタログ（set-lang.js で import 行を書き換え）
│       └── _maps/             ← Minecraft ID → 各言語名の変換データ（生成物）
│           ├── ja_JP.json
│           ├── en_US.json
│           └── (他 27 言語 ...)
├── scripts/
│   ├── build.js               ← esbuild バンドル（--full フラグでフル版）
│   ├── set-lang.js            ← 言語切替（フルロケール指定: ja_JP, en_US ...）
│   ├── publish-all.js         ← 全言語 zip 生成（無料版・フル版とも zip。npm publish はしない）
│   └── generate-maps.ts       ← _maps/ 生成スクリプト（.gitignore 対象）
├── build/                     ← ビルド出力（.gitignore 対象）。フォルダ名に "dist" を使わない理由は後述
│   ├── index.free.flyde.js    ← 無料版バンドル
│   └── index.flyde.js         ← フル版バンドル
├── releases/                  ← zip 配布物（.gitignore 対象）
│   └── flyde-minecraft-bedrock-full-ja-jp-v*.zip
├── logs/                      ← セッションごとのログファイル（.gitignore 対象）
└── flows/                     ← ユーザーが .flyde ファイルを作る場所
    ├── sample.flyde
    ├── sample2.flyde
    └── sample3.flyde
```

**重要：`flows/` は生徒の作業領域。明示的に依頼されない限り Claude Code が変更しないこと。**

---

## 開発コマンド・動作確認

```bash
npm install              # 依存パッケージのインストール
npm run typecheck        # TypeScript 型チェック（tsc --noEmit）
npm run lang:ja          # 言語を日本語（ja_JP）に切り替え
npm run lang:en          # 言語を英語（en_US）に切り替え
npm run build            # 無料版をビルド → build/index.free.flyde.js
npm run build:full       # フル版をビルド → build/index.flyde.js
npm run publish:all      # 全言語の zip 生成（無料版・フル版とも → releases/）
```

言語切替は `scripts/set-lang.js` が `index.flyde.ts`・`index.free.flyde.ts`・`_catalog.ts` の3ファイルを書き換える。

### 動作確認

1. VSCode で .flyde ファイルを開いて Flyde エディタを起動
2. フローを実行（SocketBE が localhost:8080 で起動、コンソールに接続コマンドが表示される）
3. Minecraft で `/connect localhost:8080`
4. フローの動作を確認

### テスト（自動テストフロー）

テストフローは `flows/tests/` に格納。ファイル名はセクション番号ベース（`test-06-gameplay.flyde` 等）。

テストフローは `../../build/index.flyde.js` を参照するため、**事前にビルドが必要**。

```bash
npm run build:full       # まずビルド
```

その後、テスト環境（別フォルダ）で `npm link` を使って確認する。  
詳細手順は `flows/tests/test-spec.md` の「テスト実行手順」を参照。

自動テストの結果は `logs/flyde-mc-*.log` で確認（`PASS` / `FAIL` が記録される）。

---

## ロギング

Flyde はノードを別プロセスで実行するため `console.log` が VSCode に届かない。代わりに `_nodes/diag.ts` がファイルへ書き出す。

### ログファイル

セッション（フロー実行）ごとに新しいファイルを生成する：

```
logs/flyde-mc-2026-06-10_14-30-00_1.log
```

### ログレベル

| レベル | 用途 |
|---|---|
| `DEBUG` | 内部状態・イベント詳細（開発時） |
| `INFO` | ユーザー向けの通常メッセージ（デフォルト） |
| `WARN` | 予期しない状態・エラーの予兆 |
| `ERROR` | 処理失敗・未捕捉例外 |

### 設定ファイル

プロジェクトルートの `flyde-mc.config.json` でログレベルを変更できる（git 管理対象）：

```json
{ "logLevel": "INFO" }
```

ファイルがなければ `INFO` をデフォルトとして使用する。

### ロガーの使い方（内部）

```typescript
import { diagLog } from './diag'          // _nodes/ 直下から
import { diagLog } from '../diag'         // _nodes/_core/ から

const log  = (msg: string) => diagLog('INFO',  'prefix', msg)  // ユーザー向け
const dbg  = (msg: string) => diagLog('DEBUG', 'prefix', msg)  // 内部診断
```

---

## アーキテクチャ：暗黙コンテキスト方式

シンプルな「暗黙コンテキスト＋例外スロー」方式を採用する。

### McContext シングルトン

```typescript
// context-manager.ts（内部用、外部公開しない）
setCurrentContext(world, player)  // イベントノードが呼ぶ
getCurrentContext()               // コマンドノードが呼ぶ（未接続なら例外をスロー）
```

- **イベントノード**：ハンドラ内で `setCurrentContext(world, ev.player)` を呼んでからデータを流す
- **コマンドノード**：`getCurrentContext()` で world/player を取得して使う
- 教室用途（1人ずつ使用）を前提。同時複数接続は考慮しない

### SocketBE シングルトン

```typescript
import { getServer, getCurrentWorld } from '../ws-server'
const server = getServer(8080)   // 接続系ノードのみ使用。直接 new Server() しない
const world = getCurrentWorld()  // イベントノードが world.server.on() 登録時に使用
```

### エラーハンドリング

- 接続前にコマンドを実行 → `getCurrentContext()` が例外をスロー
- Minecraft コマンドの失敗 → WebSocket 通信ライブラリが例外をスロー
- 例外は Flyde ランタイムにそのまま伝播させる（握り潰さない）

### Flyde モジュール分離とプロセスブリッジ

Flyde はフロー再起動時にモジュールキャッシュをクリアして再 `require()` する。また、同一フロー内でも `../_nodes/index.flyde.ts`（TS ソース）と `../build/index.flyde.js`（build）が混在すると別モジュールインスタンスが生成される。

これに対し、`process` オブジェクト（同一 OS プロセス内で生存し続ける）にシングルトン状態を退避するブリッジを実装している。

| `process` プロパティ | 用途 |
|---|---|
| `__fmcContext` | McContext（world + player）`context-manager.ts` |
| `__fmcServer` | WebSocket Server インスタンス `ws-server.ts` |
| `__fmcWorld` | World インスタンス `ws-server.ts` |
| `__fmcPort` | 使用ポート番号 `ws-server.ts` |
| `__fmcSignalHandlersRegistered` | SIGTERM 等のシグナルハンドラ重複登録防止フラグ |
| `__fmcRejectionHandlerRegistered` | unhandledRejection ハンドラ重複登録防止フラグ |

この仕組みにより、TS ソース参照ノードと build 参照ノードが同じフロー内に混在していても同一の状態を共有できる。

**Flyde ノードメニューへの登録**：Flyde エディタはワークスペース内の `*.flyde.ts` / `*.flyde.js` を自動スキャンしてメニューに登録する。`index.flyde.ts`（フル版）・`index.free.flyde.ts`（無料版）がその対象。メニューから配置したノードの source は `../_nodes/index.flyde.ts` となるが、process ブリッジにより build 参照ノードと共存できる。

**重要：ビルド出力フォルダ名に `dist` を使ってはいけない**。Flyde拡張（v1.0.45時点）のローカルファイルスキャンは `default-scan-filter.js` でパスに `"dist"` または `"node_modules"` を含むファイルを除外するため、`dist/index.flyde.js` のようなパスのノードはメニューに一切表示されない。さらに、`node_modules` 経由（npm依存パッケージ）で検出されたノードは、ノードメニュー構築処理（`getLibraryData`）が `source.data === "@flyde/nodes"` という固定文字列でしかフィルタしておらず、サードパーティパッケージ（`flyde-minecraft-bedrock` 含む）のノードは検出されても表示されないバグがある。この2点により、**`node_modules`／npm依存に頼らず、ビルド出力をワークスペース直下に `build/` のような名前で配置し、ローカルファイルスキャン経由で検出させる**のが唯一動作する方式。詳細は「配布・公開」セクション参照。

---

## 多言語対応

### 仕組み

`_core/` のノードは英語ポート名・言語非依存。`_factory.ts` の `localizeNode()` が `_i18n/*.json` の翻訳を適用して言語別ノードを生成する。

```typescript
// index.flyde.ts（唯一のエントリ。i18n の import 行だけ変えて言語切替）
import { localizeNode } from './_factory'
import i18n from './_i18n/ja_JP.json'  // ← npm run lang:en で en_US.json に切り替わる
import * as core from './_core/commands/gameplay'

export const RunCommand = localizeNode(core.RunCommand, i18n.RunCommand)
```

### エントリポイントと言語

| ファイル | 役割 |
|---|---|
| `index.flyde.ts` | 全ノード（フル版）兼 Flyde エディタ用エントリ |
| `index.free.flyde.ts` | 個人向け無料版（絞ったノードのみ、zip 配布用） |

言語切替は `npm run lang:ja` / `npm run lang:en`（または `node scripts/set-lang.js ja_JP`）で行う。  
`scripts/set-lang.js` が以下の3ファイルを同時に書き換える：

- `index.flyde.ts` の `import i18n from './_i18n/XX.json'`
- `index.free.flyde.ts` の `import i18n from './_i18n/XX.json'`
- `_catalog.ts` の `import maps from './_maps/XX.json'` と `const locale = 'XX'`

フルロケール（`ja_JP`, `en_US`, `ko_KR` ...）を直接指定できる。`_i18n/` にファイルを追加すれば `publish-all.js` が自動で対象に含める。

### ノードの対象層（個人向け / サーバー向け）

ノードは3軸で分類される：

| 軸 | 内容 |
|---|---|
| **ノード種別** | event / command / query / utility |
| **出力型** | 値型（number/string/boolean）/ オブジェクト型（snapshot） |
| **対象層** | 個人向け（free）/ サーバー向け（server） |

`_core/` には全ノードを実装し、`index.flyde.ts` が全ノードを export する。

---

## 配布・公開

### なぜ zip 配布か

Flyde のカスタムノードは「ワークスペース内のファイルをスキャンして Local グループに表示する」のが標準の仕組み。zip を展開してそのフォルダをワークスペースとして開くと、`build/index.flyde.js` がワークスペース内のファイルとして自動検出されノードメニューに表示される。これは Flyde の設計に沿った方式であり、回避策ではない。

npm でサードパーティノードを配布してユーザーが `npm install` で使う方式は、Flyde がまだ対応していないユースケース（v1.0.45 時点）。

注意：ビルド出力フォルダ名に `dist` を使ってはいけない。`scanImportableNodes` はパスに `dist` または `node_modules` を含むファイルを除外する（`default-scan-filter.js`）ため、`dist/index.flyde.js` はメニューに表示されない。このため出力先は `build/` としている。

### ライセンス構成（デュアルライセンス）

| 版 | ライセンス | ライセンスファイル |
|---|---|---|
| 無料版（zip） | Prosperity Public License 3.0.0 | `LICENSE.md` |
| フル版（zip） | 商用ライセンス（再配布・改造禁止） | `LICENSE-COMMERCIAL.md`（zip に `LICENSE.md` として同梱） |

- 無料版：非商用目的（個人・学校・公的機関等）は無償。商用利用は30日間のトライアルのみ、それ以降は商用ライセンスが必要
- フル版：購入者の個人・教室内使用のみ可。再配布・再販禁止

### 版の構成

| 版 | エントリ | 配布方法 | 内容 |
|---|---|---|---|
| 無料版 | `index.free.flyde.ts` | zip（言語別、ベータ公開） | 個人向けノードのみ |
| フル版 | `index.flyde.ts` | Gumroad zip（言語別、購入者向け） | 全ノード |

### zip ファイル名規則

- `releases/flyde-minecraft-bedrock-free-{localeSlug}-v{version}.zip`
- `releases/flyde-minecraft-bedrock-full-{localeSlug}-v{version}.zip`
- `localeSlug` はロケール識別子そのまま（例: `ja_JP`、`en_US`）

### publish フロー（`npm run publish:all`）

言語ごとに以下を繰り返す（npm publish は行わない）：

1. `set-lang.js {locale}` で言語切替
2. `build.js` で無料版をビルド → `releases/flyde-minecraft-bedrock-free-{locale}-v{version}.zip` 生成
3. `build.js --full` でフル版をビルド → `releases/flyde-minecraft-bedrock-full-{locale}-v{version}.zip` 生成

全言語処理後、無料版ベータzipのみ `gh release create` で公開サイトリポジトリ（`flyde-minecraft-bedrock-site`）にアップロードする。フル版zipは有料のため `releases/` に置くのみ（手動でGumroad等にアップロード）。

zip 内容（ソースなし、完全なプロジェクトテンプレート）：

```
flyde-minecraft-bedrock/
  package.json         peerDependencies一覧（参考情報。Flydeのノード検出には使われない）
  LICENSE.md           商用ライセンス（LICENSE-COMMERCIAL.md の内容）
  build/
    index.flyde.js     全ノード minify 済み（_i18n・_maps を内包）
  flows/
    *.flyde            サンプルフロー
  flyde-mc.config.json  logLevel: INFO
```

### _catalog.ts の言語対応

`_catalog.ts` は静的 import を使用。`set-lang.js` が言語切替時に書き換える：

```typescript
import maps from './_maps/ja_JP.json'  // set-lang.js で書き換え
const locale = 'ja_JP'                 // 同上
```

esbuild バンドル時に JSON が JS に埋め込まれるため、配布物に `_maps/*.json` は不要。

---

## ノードの実装規則

### 基本パターン（_core/ の CodeNode）

ポート名は**英語**。表示名（displayName）も英語のまま。翻訳は `_i18n/` で行う。

```typescript
import { CodeNode } from '@flyde/core'
import { getCurrentContext } from '../../context-manager'

export const RunCommand: CodeNode = {
  id: 'RunCommand',
  displayName: 'RunCommand',
  menuDisplayName: 'RunCommand',
  icon: 'play',
  defaultStyle: { color: '#8F6D40' },
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    command: { description: 'Minecraft command to run (without /)' },
  },
  outputs: {
    done: {},
  },
  run: async ({ command }, { done }) => {
    const { world } = getCurrentContext()
    await world.runCommand(String(command))
    done.next(true)
  },
}
```

### ポート名ルール

- `_core/` のポート名は**英語**（半角 10 文字以内）
- オブジェクト型の出力ポートは `O_` プレフィックスなし。エンティティ名をそのまま使う
  - `player` / `block` / `item` / `mob` / `villager` / `fuel` / `payment_a` / `payment_b`
- `_i18n/` で日本語名に翻訳（全角 5 文字以内）

### コマンドノードの実装指針

**個別コマンドノードは `CommandResult<T>` に追加データ T がある場合にのみ作成する。**

socket-be のコマンド API は `Promise<CommandResult<T>>` を返す（`CommandResult<T> = { statusCode, statusMessage } & T`）。  
T={} のコマンドは「完了した／例外が出なかった」という情報しか持たず、個別ノード化する価値がない。

| 方針 | 対象 | 例 |
|---|---|---|
| 個別ノードを作る | T にデータフィールドがある | `GetGameTime`（data）、`FillBlocks`（fillCount）、`GetPlayerLocation`（position）など |
| RunCommand で代用 | T = {}（追加データなし） | `weather rain`、`time set 6000`、`gamemode creative` など |

また、1ワールド前提のため `server.broadcastCommand()` は使用しない。Minecraft コマンドの実行は常に `world.runCommand()` を使う。

### ノード種別ごとの規則

| 種別 | 出力ポート | コンテキスト |
|---|---|---|
| コマンド系 | `done`（true） | `getCurrentContext()` で取得 |
| クエリ系 | データ値（座標・数値・真偽値など） | `getCurrentContext()` で取得 |
| イベント系 | データ値 + オブジェクト、`completionOutputs: []` | ハンドラ内で `setCurrentContext()` を呼ぶ |
| ユーティリティ系 | 変換・選択結果 | コンテキスト不要（純粋関数） |
| 接続系 | `world`（World オブジェクト） | シングルトン経由でサーバー起動 |

### イベントノードのパターン

```typescript
import { ServerEvent, type PlayerChatSignal } from '../../types'
import { setCurrentContext } from '../../context-manager'
import { getCurrentWorld } from '../../ws-server'

run: (_, { sender, message, player }, adv) => {
  const world = getCurrentWorld()!
  const handler = (ev: PlayerChatSignal) => {
    setCurrentContext(world, ev.sender)
    sender.next(ev.sender.name)
    message.next(ev.message)
    player.next(ev.sender)          // オブジェクト型出力（スナップショット全体）
  }
  world.server.on(ServerEvent.PlayerChat, handler)
  adv.onCleanup(() => world.server.remove(ServerEvent.PlayerChat, handler))
},
```

### スナップショット出力のパターン

イベントノードは個別フィールドに加え、オブジェクト全体をオブジェクト型ポートで出力する。  
ユーザーはそれを `utils/info.ts` の情報取得ノード（プルダウン選択）に繋いで任意のフィールドを取り出す。

```typescript
player.next(ev.sender)             // WorldPlayer スナップショット全体
block.next(ev.brokenBlockType)     // BlockType スナップショット全体
```

### アイコンとスタイル色

```typescript
icon: 'bolt'             // イベント系
icon: 'play'             // コマンド実行
icon: 'magnifying-glass' // クエリ系
icon: 'shuffle'          // 情報取得系
icon: 'language'         // 変換系
icon: 'cube'             // ブロック選択系
icon: 'list-check'       // イベント値選択系
icon: 'robot'            // エージェント系
icon: 'list-ol'          // スコアボード系
icon: 'calculator'       // 数学・座標系
icon: 'plug'             // 接続系
```

| 種別 | 色 |
|---|---|
| イベント系 | `#25567D` |
| コマンド・ゲームプレイ系・スコアボード系 | `#8F6D40` |
| プレイヤー操作系 | `#0078D7` |
| エージェント系 | `#D83B01` |
| ユーティリティ系（info / selectors / converters） | `#767676` |
| 座標・数学系 | `#107C10` |
| 接続系 | `#5C5C5C` |

### ノード追加時の手順

0. `CommandResult<T>` に追加データ T があるか確認する。T={} の場合は個別ノードを作らず、ユーザーに RunCommand でコマンドを直接設定してもらう
1. `_core/` 内の追加先ファイルを選ぶ
   - スナップショット情報取得 → `_core/utils/info.ts`
   - ID・イベント値選択 → `_core/utils/selectors.ts`
   - ロケール名変換 → `_core/utils/converters.ts`
   - 座標・数値演算 → `_core/utils/math.ts`
   - プレイヤーイベント → `_core/events/player.ts`、ブロック/アイテム/モブ → 対応する `_core/events/*.ts`
   - ゲームプレイ系コマンド/クエリ → `_core/commands/gameplay.ts`
   - プレイヤー操作コマンド/クエリ → `_core/commands/player.ts`
   - エージェント操作 → `_core/agents.ts`
   - スコアボード → `_core/scoreboard.ts`
2. `_i18n/ja_JP.json` と `_i18n/en_US.json` にノードエントリを追加する（ポート名・displayName・select ラベルの翻訳）
3. `_nodes/index.flyde.ts` に `localizeNode()` 呼び出しを追加する
4. `03_Flydeノード設計.md` のノード一覧テーブルを更新する

---

## .flyde ファイル形式

`flows/*.flyde` は YAML 形式。**Flyde エディタが自動生成する**が、手動編集や AI による生成も可能。

### インスタンスの構造

```yaml
instances:
  - id: my-node          # フロー内でユニークな ID（任意の文字列）
    type: code
    nodeId: RunCommand   # CodeNode の id フィールドと一致させる
    source:
      type: file
      data: "../_nodes/index.flyde.ts"   # .flyde ファイルからの相対パス
    config:              # 各入力ポートの値を ConfigurableValue 形式で設定
      command:
        type: string
        value: "time set day"
      trigger:
        type: dynamic    # ワイヤー接続を受け取るピンになる
    inputConfig: {}      # キュー/スティッキー制御（通常 {} で OK）
    pos:
      x: 300
      y: 200
```

config のキーは**エントリポイントが公開するポート名**（日本語エントリなら日本語名、英語エントリなら英語名）を使う。

### ConfigurableValue（config フィールドの値）

| type | 用途 | value の型 |
|---|---|---|
| `dynamic` | ワイヤーで受け取る（ピンを生成） | 不要（省略可） |
| `string` | 文字列 IIP | `"文字列"` |
| `number` | 数値 IIP | `123` |
| `boolean` | 真偽値 IIP | `true` / `false` |
| `select` | 選択肢 IIP（`editorType: 'select'` のポート） | `"内部英語値"` |
| `json` | オブジェクト/配列 IIP | YAML マッピング/シーケンス |

`config` に指定しないポートは自動的に `dynamic` 扱いになる（ピンが生成される）。  
`type: boolean/number/select/json` を指定したポートはピンが生成されず、値が焼き込まれる（ワイヤー不要）。

**`select` の value は必ず内部英語値を使う**。`localizeNode()` はメニュー表示ラベルを翻訳するが、YAML に保存される value は翻訳前の英語値のまま。日本語ラベルを value に書くとノードのコードが値を認識できずサイレントに動作しない。

```yaml
# 正しい例
演算:
  type: select
  value: floor      # 内部英語値

# 誤った例（日本語ラベルをそのまま書いた場合）
演算:
  type: select
  value: 切り捨て   # NG：コードが認識できない
```

### 文字列テンプレートで座標を展開する

`type: string` の value に `{{ポート名.フィールド}}` を書くと、そのポート名のピンが生成される。

```yaml
command:
  type: string
  value: "summon chicken {{position.x}} {{position.y}} {{position.z}}"
```

接続で `vec-add.result → summon.position` のようにオブジェクト `{x, y, z}` を流すと、  
実行時に `"summon chicken 10 74 20"` のように展開される。

### 接続の構造

```yaml
connections:
  - from:
      insId: source-node-id
      pinId: 出力ポート名
    to:
      insId: target-node-id
      pinId: 入力ポート名     # dynamic なポートのみ接続できる
```

接続できるのは `type: dynamic`（または config 未設定）なポートのみ。  
IIP（boolean/number/string/json/select）で焼き込んだポートはワイヤー接続不可。

