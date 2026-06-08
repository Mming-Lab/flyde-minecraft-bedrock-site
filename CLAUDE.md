# CLAUDE.md

## プロジェクト概要

Minecraft Education Edition をビジュアルフロープログラミングで操作する教室用ツール。  
子どもたちが Flyde のノードをワイヤーで繋ぐだけで Minecraft と連携できる。

パッケージ名：`flyde-minecraft-bedrock-ws`

| パッケージ | 役割 |
|---|---|
| `socket-be` | Minecraft WebSocket 通信 |
| `@minecraft/vanilla-data` | ブロック・エンティティ名の enum |
| `@minecraft/math` | Vector3 / AABB 演算の参照実装 |
| `@flyde/core` | Flyde の CodeNode 型定義・ランタイム |

---

## ディレクトリ構成

```
mc-flow-template/
├── CLAUDE.md
├── package.json
├── tsconfig.json              ← "types": ["node"] が必須
├── _nodes/
│   ├── index.flyde.ts         ← 全ノード実装 兼 Flyde エディタ用エントリ（唯一の .flyde.ts）
│   ├── _factory.ts            ← localizeNode()：_core ノード + _i18n → 言語別ノード生成
│   ├── context-manager.ts     ← McContext シングルトン（内部用）
│   ├── ws-server.ts           ← WebSocket サーバーシングルトン（内部用）
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
│   │   └── (他 27 言語 ...)
│   └── utils/
│       ├── _catalog.ts        ← ブロック/アイテム/モブ/イベントのカタログデータ（内部用）
│       └── _maps/             ← Minecraft ID → 各言語名の変換データ（生成物）
│           ├── ja_JP.json
│           ├── en_US.json
│           └── (他 27 言語 ...)
└── flows/                     ← 生徒が .flyde ファイルを作る場所
    ├── sample.flyde
    ├── sample2.flyde
    └── sample3.flyde
```

**重要：`flows/` は生徒の作業領域。明示的に依頼されない限り Claude Code が変更しないこと。**

---

## 開発コマンド・動作確認

```bash
npm install        # 依存パッケージのインストール
npm run typecheck  # TypeScript 型チェック（tsc --noEmit）
```

ユニットテストなし。動作確認は Minecraft 実機で行う：

1. VSCode で .flyde ファイルを開いて Flyde エディタを起動
2. フローを実行（SocketBE が localhost:8080 で起動、コンソールに接続コマンドが表示される）
3. Minecraft で `/connect localhost:8080`
4. フローの動作を確認

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

`index.flyde.ts` が唯一の実装ファイル。`_i18n/*.json` の import 行を書き換えることで言語が切り替わる。

| ファイル | 役割 |
|---|---|
| `index.flyde.ts` | 全ノード実装 兼 Flyde エディタ用エントリ（唯一の `.flyde.ts`） |

言語切替は `npm run lang:ja` / `npm run lang:en` スクリプトで行う（`index.flyde.ts` の i18n import 行を書き換えるだけ）。

### ノードの対象層（個人向け / サーバー向け）

ノードは3軸で分類される：

| 軸 | 内容 |
|---|---|
| **ノード種別** | event / command / query / utility |
| **出力型** | 値型（number/string/boolean）/ オブジェクト型（snapshot） |
| **対象層** | 個人向け（free）/ サーバー向け（server） |

`_core/` には全ノードを実装し、`index.flyde.ts` が全ノードを export する。

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
| `select` | 選択肢 IIP（`editorType: 'select'` のポート） | `"選択値"` |
| `json` | オブジェクト/配列 IIP | YAML マッピング/シーケンス |

`config` に指定しないポートは自動的に `dynamic` 扱いになる（ピンが生成される）。  
`type: boolean/number/select/json` を指定したポートはピンが生成されず、値が焼き込まれる（ワイヤー不要）。

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

---

## 設計書の場所

```
\\as6702t-7258\Public\01_mming\14_研究開発\技術資料\Flyde-Minecraft-WS\
├── 01_技術選定経緯.md
├── 02_システムアーキテクチャ.md
├── 03_Flydeノード設計.md   ← ノード一覧はここ
└── 04_統合設計.md          ← 実装パターンはここ
```

ノードを追加・変更したときは設計書も更新する（doc-updater エージェントを使う）。
