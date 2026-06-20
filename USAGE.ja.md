[🇺🇸 English](USAGE.md) | 🇯🇵 日本語

# 使い方

## 1. 準備するもの

- [VSCode](https://code.visualstudio.com/)
- VSCode拡張機能「[Flyde](https://marketplace.visualstudio.com/items?itemName=flyde.flyde-vscode)」
- Node.js（npm が使えること）
- Minecraft Education Edition または Bedrock Edition（WebSocket 接続が有効なもの）

## 2. プロジェクトの準備

1. zip をダウンロードして展開すると `flyde-minecraft-bedrock-nodes` フォルダが手に入ります
2. そのフォルダ内でターミナルを開き、依存パッケージをインストール

```bash
cd flyde-minecraft-bedrock-nodes
npm install
```

3. `flyde-minecraft-bedrock-nodes` フォルダ自体をVSCodeで開く（フォルダを開く）

Flyde は開いているワークスペース内のファイルを自動スキャンします。`build/` フォルダのノードが Flyde エディタの「Local」グループに自動で表示されます。

この手順はフル版（購入後）でも同じです。

## 3. フローファイルを作る

`flyde-minecraft-bedrock-nodes` フォルダ内のどこか（例：`flows/`）に `.flyde` ファイルを新規作成すると、Flyde エディタが起動します。

`build/index.flyde.js` のノードが自動でノードメニューに表示されるので、ドラッグ＆ドロップでフローを組み立てます。

Flyde 本体が提供する標準ノード（条件分岐・リスト操作など）の一覧は [flyde-standard-nodes.md](flyde-standard-nodes.md) を参照してください。

最小構成の例：

```
MinecraftConnect（ポート: 8080）
   └─ done → OnPlayerChat（player接続後に有効）
              └─ message → RunCommand（command: "say Hello!"）
```

## 4. 実行と接続

1. Flyde エディタでフローを実行（▶Test Flowボタン）
2. ログファイルに接続用コマンドが表示されます（例：`/connect localhost:8080`）
3. Minecraft 内のチャット欄でそのコマンドを実行
4. 接続が完了すると、フローが Minecraft 内のイベントに反応し始めます

## 5. サンプルフロー

[examples/](examples/) フォルダに、すぐ試せる完成済みのサンプルフロー（日本語版）を置いています。`flyde-minecraft-bedrock-nodes/flows/` フォルダにコピーして開いてください。

| ファイル | 内容 |
|---|---|
| [block-info.ja.flyde](examples/block-info.ja.flyde) | ブロックを設置・破壊したときにプレイヤー名・座標・ブロック名・所持アイテム名をチャットに表示する。チャットで「dis」と入力すると切断する |
| [chicken-rain.ja.flyde](examples/chicken-rain.ja.flyde) | チャットで「chicken」と入力すると、プレイヤーの10ブロック上にニワトリを100羽召喚する |

## トラブルシューティング

- **ノードメニューに表示されない**：`flyde-minecraft-bedrock-nodes` フォルダ自体をVSCodeのワークスペースルートとして開いているか（それを含む親フォルダを開いていないか）、フォルダ内で `npm install` を実行済みか、`flyde-minecraft-bedrock-nodes/build/` にビルド済みJSが存在するかを確認してください。
- **接続できない**：Minecraft 側でチート（コマンド）が有効になっているか、ポート番号が一致しているか確認してください。
- **フローが反応しない**：イベント系ノード（`On~`）は接続後に発生したイベントにのみ反応します。フロー実行 → Minecraft 接続の順序を確認してください。

## ライセンスについて

このパッケージは [Prosperity Public License 3.0.0](LICENSE.md) のもとで提供されています。非商用目的（個人の学習・趣味・学校・公的機関など）であれば無期限に無料で利用できます。プログラミング教室など営利目的の教育事業での利用（商用利用）は30日間の無料トライアルが可能で、それ以降は有料のPatron License（フル機能版）が必要です。

商用利用やエージェント操作・スコアボードなどを含むフル機能版は、~~[Gumroad](#)~~ / ~~[BOOTH](#)~~（準備中）にて販売予定です。
