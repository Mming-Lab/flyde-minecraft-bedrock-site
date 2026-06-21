[🇺🇸 English](README.md) | 🇯🇵 日本語

# flyde-minecraft-bedrock

![screenshot](assets/images/screenshot_ja.png)

Minecraft Education Edition / Bedrock Edition を、ビジュアルフロープログラミング（[Flyde](https://github.com/flydelabs/flyde)）で操作するためのノード集です。

ノードをワイヤーで繋ぐだけで、プレイヤーの行動やブロック・アイテムのイベントをきっかけに Minecraft 内でコマンドを実行したり、座標・状態を取得したりするフローを作れます。プログラミング教育の教室での利用を想定しています。

## 無料・オープンソース

このリポジトリでは、完全なソースコード・使い方ガイドを、すべて [PolyForm Noncommercial License](#ライセンス) のもと無料で公開しています。

## インストール

このリポジトリを `git clone`（またはGitHubの「Download ZIP」）して `npm install` してください。セットアップ手順は [USAGE.ja.md](USAGE.ja.md) を参照してください。

## 含まれるノード

- **接続**：Minecraft サーバーへの接続・切断
- **プレイヤーイベント**：チャット・移動・テレポート・バウンド・変身・参加・退出・タイトル表示・メッセージ通知
- **ブロックイベント**：設置・破壊
- **アイテムイベント**：使用・入手・クラフト・装備・精錬・取引
- **モブイベント**：モブとのインタラクト・狙ったブロックへの命中判定
- **ゲームプレイコマンド**：コマンド実行・時刻・天気・エリア塗りつぶし
- **プレイヤーコマンド**：座標・向き・ゲームモード取得、経験値レベル・装備状態、オンラインプレイヤー一覧、タグ管理
- **エージェント操作**：プログラム可能なエージェントの移動・採掘・設置・アイテム操作
- **スコアボード**：得点・変数管理
- **情報取得**：エンティティ・プレイヤー・アイテム・ブロック・モブ・村人・スコアボード・ワールドのスナップショットから値を取り出す
- **変換・選択**：セレクター文字列の組み立て、ロケール名変換
- **座標演算**：ベクトル演算・距離計算・クランプ・AABB・補間・正規化・内積・文字列化・分解

詳しい使い方は [USAGE.ja.md](USAGE.ja.md) を参照してください。

## 動作環境

- Minecraft Education Edition または Bedrock Edition（WebSocket 接続が有効なもの）
- [Flyde](https://github.com/flydelabs/flyde) (VSCode拡張)

## ライセンス

[PolyForm Noncommercial License 1.0.0](LICENSE.md) — 非商用目的（個人・学校・公的機関等）であれば無期限に無料です。商用利用をご希望の場合は Mming Lab にご連絡ください。コントリビューションも歓迎します。詳しくは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

これを使って何かを作って公開する場合（動画やブログ記事など）、Mming Lab / flyde-minecraft-bedrock への言及をいただけると嬉しいです！
