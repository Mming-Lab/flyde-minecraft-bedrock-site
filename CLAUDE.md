# mc-flow-template プロジェクト

## 配置場所
このファイルは `mc-flow-template/CLAUDE.md` に置く。

---

## プロジェクト概要

Minecraft Education Edition と micro:bit をビジュアルフロープログラミングで操作する教室用ツール。  
子どもたちが Flyde のノードをワイヤーで繋ぐだけで Minecraft と連携できる。

## ディレクトリ構成

```
mc-flow-template/
├── CLAUDE.md              ← このファイル
├── package.json
├── tsconfig.json
├── .claude/
│   └── agents/
│       ├── node-implementer.md  ← ノード実装エージェント
│       └── doc-updater.md       ← 設計書更新エージェント
├── .vscode/
│   └── settings.json      ← _nodes/ を VSCode エクスプローラーから非表示にする
├── _nodes/                ← ノードの実装（生徒は触らない）
│   ├── index.ts           ← 全ノードを export
│   ├── connection.ts      ← 接続系（MC・micro:bit）
│   ├── events.ts          ← イベント系（Minecraft → フロー）
│   ├── commands.ts        ← コマンド系（フロー → Minecraft）
│   ├── agent.ts           ← エージェント系
│   ├── microbit.ts        ← micro:bit シリアル通信
│   ├── result.ts          ← Result 型・鉄道指向ノード
│   ├── transforms.ts      ← 変換系ノード
│   ├── http.ts            ← REST API 連携（オプション）
│   ├── socketbe-instance.ts ← SocketBE シングルトン
│   └── types/
│       └── common.ts      ← 共通型定義
└── flows/                 ← 生徒が .flyde ファイルを作る場所
    └── sample.flyde
```

**重要：`flows/` は生徒の作業領域。Claude Code が勝手に変更しないこと。**

---

## ノードの実装規則

### 基本パターン（CodeNode）

```typescript
import { CodeNode } from '@flyde/core'

export const ノード名: CodeNode = {
  id: "英語のID",
  displayName: "日本語の表示名",
  inputs: {
    入力ポート名: { description: "説明" }
  },
  outputs: {
    Result: {}   // コマンド系は必ず Result 型
  },
  run: async ({ 入力ポート名 }, { Result: result }) => {
    try {
      // 処理
      result.next(Ok(true))
    } catch (e) {
      result.next(Err(String(e)))
    }
  }
}
```

### Result 型の規則

- **コマンド系・エージェント系・micro:bit送信系**：出力は必ず `Result` 型
- **イベント系**：Result 型不要（正常系のみ）
- **変換系**：Result 型不要（純粋関数）
- **接続系**：`接続完了` と `エラー` の別ポート（Result 型ではない）

```typescript
// _nodes/types/common.ts から import
import { Ok, Err, Result } from './types/common'
```

### IIP（部分適用）の活用

固定値はノードのインスタンス設定（IIP）で渡す設計にする。  
ノード定義では必須扱いにしておき、フロー側で固定値を設定する。

### ノード追加時の手順

1. 対応する `.ts` ファイルに `CodeNode` を追加
2. `_nodes/index.ts` に export を追加
3. `03_Flydeノード設計.md` のノード一覧テーブルを更新

---

## 主要パッケージと役割

| パッケージ | 役割 |
|---|---|
| `socket-be` | Minecraft WebSocket 通信 |
| `serialport` | micro:bit USB シリアル通信 |
| `@serialport/parser-readline` | シリアルの行単位パーサー |
| `@minecraft/vanilla-data` | ブロック・エンティティ名の enum |
| `@flyde/core` | Flyde の CodeNode 型定義 |
| `express` | REST API（オプション） |

---

## SocketBE シングルトン

```typescript
// 必ずこの関数経由でインスタンスを取得する
import { getServer } from './socketbe-instance'
const server = getServer(8080)
```

直接 `new Server()` しない。同一プロセスで複数インスタンスが起動するのを防ぐため。

---

## テスト方針

**ユニットテストなし。手動テストのみ。**

動作確認手順：
1. `npm install`
2. VSCode で .flyde ファイルを開いて Flyde エディタを起動
3. フローを実行（SocketBE が localhost:8080 で起動）
4. Minecraft で `/connect localhost:8080`
5. フローの動作を確認

---

## 設計書の場所

```
\\as6702t-7258\Public\01_mming\11_議事録\80_情報\技術資料\Flyde-Minecraft-WS\
├── 01_技術選定経緯.md
├── 02_システムアーキテクチャ.md
├── 03_Flydeノード設計.md   ← ノード一覧はここ
└── 04_統合設計.md          ← 実装パターンはここ
```

ノードを追加・変更したときは設計書も更新する（doc-updater エージェントを使う）。
