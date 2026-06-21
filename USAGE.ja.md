[🇺🇸 English](USAGE.md) | 🇯🇵 日本語

# 使い方

## 1. 準備するもの

- [VSCode](https://code.visualstudio.com/)
- VSCode拡張機能「[Flyde](https://marketplace.visualstudio.com/items?itemName=flyde.flyde-vscode)」
- Node.js（npm が使えること）
- Minecraft Education Edition または Bedrock Edition（WebSocket 接続が有効なもの）

## 2. プロジェクトの準備

1. このリポジトリを `git clone`（またはGitHubの「Download ZIP」）すると `flyde-minecraft-bedrock` フォルダが手に入ります
2. そのフォルダ内でターミナルを開き、依存パッケージをインストール

```bash
cd flyde-minecraft-bedrock
npm install
```

3. `flyde-minecraft-bedrock` フォルダ自体をVSCodeで開く（フォルダを開く）

Flyde は開いているワークスペース内のファイルを自動スキャンします。`_nodes/index.flyde.ts` のノードが Flyde エディタの「Local」グループに自動で表示されます（ビルド不要）。

## 3. 言語切替（任意）

デフォルトではノード名が英語になっています。日本語など対応している29言語に切り替えるには：

```bash
npm run lang -- ja_JP
```

ノード名・ポート名・Minecraft のブロック/アイテム/モブ名の翻訳が、プロジェクト全体で一括して切り替わります。対応ロケールの一覧は [_nodes/_i18n/](_nodes/_i18n/) 内のファイルを参照してください。

⚠️ **言語切替はフローを作り始める前に行ってください。** ポート名は`.flyde`ファイルに焼き込まれます。フローを作った後に言語を切り替えると、配線が外れるだけでなく、各ノードに入力した設定値（文字列・数値など）も古いポート名に紐づいたまま取り残されて失われます。配線を繋ぎ直すだけでは済まず、ノードの設定をやり直す必要があります。先に言語を決めてから作り始めてください。

## 4. フローファイルを作る

`flyde-minecraft-bedrock` フォルダ内のどこか（例：`flows/`）に `.flyde` ファイルを新規作成すると、Flyde エディタが起動します。

`index.flyde.ts` のノードが自動でノードメニューに表示されるので、ドラッグ＆ドロップでフローを組み立てます。

Flyde 本体が提供する標準ノード（条件分岐・リスト操作など）の一覧は [flyde-standard-nodes.md](flyde-standard-nodes.md) を参照してください。

最小構成の例：

```
MinecraftConnect（ポート: 8080）
   └─ done → OnPlayerChat（player接続後に有効）
              └─ message → RunCommand（command: "say Hello!"）
```

## 5. 実行と接続

1. Flyde エディタでフローを実行（▶Test Flowボタン）
2. ログファイルに接続用コマンドが表示されます（例：`/connect localhost:8080`）
3. Minecraft 内のチャット欄でそのコマンドを実行
4. 接続が完了すると、フローが Minecraft 内のイベントに反応し始めます

## 6. サンプルフロー

[examples/](examples/) フォルダに、すぐ試せる完成済みのサンプルフローを置いています。`flyde-minecraft-bedrock/flows/` フォルダにコピーして開いてください。

| ファイル | 内容 |
|---|---|
| [chicken-rain.ja.flyde](examples/chicken-rain.ja.flyde) | チャットで「chicken」と入力すると、プレイヤーの10ブロック上にニワトリを100羽召喚する |
| [chicken-rain.en.flyde](examples/chicken-rain.en.flyde) | 同上（英語ノード名版）。使うには先に `npm run lang -- en_US` で言語切替が必要（手順3参照） |
| [block-info.ja.flyde](examples/block-info.ja.flyde) | ブロックを設置・破壊したときにプレイヤー名・座標・ブロック名・所持アイテム名をチャットに表示する。チャットで「dis」と入力すると切断する |

※ デフォルトの言語は英語（en_US）です。日本語ノード名版のサンプルを使うには、先に `npm run lang -- ja_JP` で言語切替してください（手順3参照）。

## トラブルシューティング

- **ノードメニューに表示されない**：`flyde-minecraft-bedrock` フォルダ自体をVSCodeのワークスペースルートとして開いているか（それを含む親フォルダを開いていないか）、フォルダ内で `npm install` を実行済みかを確認してください。
- **接続できない**：Minecraft 側でチート（コマンド）が有効になっているか、ポート番号が一致しているか確認してください。
- **フローが反応しない**：イベント系ノード（`On~`）は接続後に発生したイベントにのみ反応します。フロー実行 → Minecraft 接続の順序を確認してください。

## ライセンスについて

このパッケージは [PolyForm Noncommercial License 1.0.0](LICENSE.md) のもとで提供されています。非商用目的（個人の学習・趣味・学校・公的機関など）であれば無期限に無料で利用できます。商用利用（プログラミング教室など営利目的の教育事業での利用を含む）をご希望の場合は Mming Lab にご連絡ください。
