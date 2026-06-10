# テスト仕様書

対象：フル版（`index.flyde.ts`）全ノード  
更新日：2026-06-10

---

## テスト環境

### 必要なもの

- Minecraft 統合版（Windows PC 推奨）
- VSCode + Flyde 拡張機能
- mc-flow-template フル版（`npm install` 済み）
- Creative モードのワールド（コマンド実行権限あり）
- エージェント系テスト用：Education Edition モードを有効にしてエージェントを召喚しておく

### 共通セットアップ

1. VSCode で `flows/` に新しい `.flyde` ファイルを作成
2. フローを実行（SocketBE が localhost:8080 で起動）
3. Minecraft で `/connect localhost:8080`
4. コンソールに接続メッセージが出ることを確認

### フロー表記の読み方

```
[ノードA] → [ノードB]          # ノードAの出力をノードBに接続
[ノードA: 設定値]              # ノードAに値を設定
[SendMessage: "{変数}"]       # 変数の内容をチャットに表示して確認
```

---

## 1. 接続系

| ID | ノード | フロー構成 | Minecraft での操作 | 確認内容 | 結果 |
|---|---|---|---|---|---|
| TC-001 | MinecraftConnect | `[MinecraftConnect]` を配置してフロー実行 | `/connect localhost:8080` | world ポートに値が流れる / チャットに接続メッセージが出る | □ |
| TC-002 | MinecraftDisconnect | `[ボタン] → [MinecraftDisconnect]` | ボタンをクリック | MC との接続が切れる / 再接続できる | □ |

---

## 2. プレイヤーイベント系

**共通前提：** MC に接続済み、プレイヤーが1名いる  
**共通フロー：** `[OnXxx: 出力ポート] → [SendMessage: "{出力}"]` で MC チャットに表示して確認

| ID | ノード | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-011 | OnPlayerChat（チャット受信時） | MC でチャットメッセージを送信 | sender（送信者名）・message（内容）が正しく出力される | □ |
| TC-012 | OnPlayerTravelled（プレイヤー移動時） | MC でプレイヤーを歩かせる | distanceTraveled が出力される | □ |
| TC-013 | OnPlayerTeleported（テレポート時） | MC で `/tp 0 64 0` を実行 | player ポートが発火する | □ |
| TC-014 | OnPlayerBounced（バウンド時） | MC でスライムブロックの上でジャンプ | player ポートが発火する | □ |
| TC-015 | OnPlayerJoin（プレイヤー参加時） | 別のプレイヤーがワールドに参加 | player ポートが発火する、名前が正しい | □ |
| TC-016 | OnPlayerLeave（プレイヤー退出時） | 別のプレイヤーがワールドを退出 | player ポートが発火する | □ |
| TC-017 | OnPlayerTitle（タイトル受信時） | MC で `/title @a title "test"` を実行 | titleText が "test" で出力される | □ |
| TC-018 | OnPlayerMessage（メッセージ受信時） | MC で `/tell @a hello` を実行 | message が出力される | □ |
| TC-019 | OnPlayerTransform（プレイヤー位置変化時） | MC でプレイヤーを移動させる | position（x/y/z）が出力される | □ |

---

## 3. ブロックイベント系

| ID | ノード | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-021 | OnBlockBroken（ブロック破壊時） | MC でブロックを壊す | blockType（ブロック名）・position が正しく出力される | □ |
| TC-022 | OnBlockPlaced（ブロック設置時） | MC でブロックを置く | blockType・position が正しく出力される | □ |

---

## 4. アイテムイベント系

| ID | ノード | 前提 | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|---|
| TC-031 | OnItemInteracted（アイテム使用時） | 使えるアイテムを持つ | アイテムを右クリック | item ポートが発火する | □ |
| TC-032 | OnItemAcquired（アイテム取得時） | — | ブロックを壊してドロップを拾う | item（アイテム名）が出力される | □ |
| TC-033 | OnItemCrafted（クラフト時） | 材料を持つ | クラフトテーブルでアイテムを作る | item が出力される | □ |
| TC-034 | OnItemEquipped（アイテム装備時） | 装備できるアイテムを持つ | 防具・ツールをホットバーに持つ | item が出力される | □ |
| TC-035 | OnItemSmelted（精錬時） | かまど + 精錬できる素材を持つ | かまどで精錬が完了する | item が出力される | □ |
| TC-036 | OnItemTraded（取引時） | 村人の近く | 村人と取引する | item が出力される | □ |

---

## 5. モブイベント系

| ID | ノード | 前提 | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|---|
| TC-041 | OnMobInteracted（モブ交流時） | 動物（ウシ・ニワトリ等）の近く | モブを右クリック | mob（モブ名）が出力される | □ |
| TC-042 | OnTargetBlockHit（的命中時） | 的ブロックを設置する | 矢を的に当てる | signal strength が出力される | □ |

---

## 6. ゲームプレイコマンド系

**共通前提：** MC に接続済み

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-051 | RunCommand（コマンド実行） | `[ボタン] → [RunCommand: "time set day"]` | 昼になる | □ |
| TC-052 | GetGameTime（ゲーム時刻取得） | `[ボタン] → [GetGameTime] → [SendMessage]` | 0〜24000 の数値がチャットに表示 | □ |
| TC-053 | IsDaytime（昼判定） | `[ボタン] → [IsDaytime] → [SendMessage]` | true / false がチャットに表示 | □ |
| TC-054 | GetWeather（天気取得） | `[ボタン] → [GetWeather] → [SendMessage]` | "clear" / "rain" / "thunder" が表示 | □ |
| TC-055 | SetTimeOfDay（時刻設定） | `[ボタン] → [SetTimeOfDay: "noon"]` | 昼正午になる | □ |
| TC-056 | SetWeather（天気設定） | `[ボタン] → [SetWeather: "rain"]` | 雨になる | □ |
| TC-057 | FillBlocks（エリア塗りつぶし） | `[ボタン] → [FillBlocks: from/to/block を設定]` | 指定範囲がブロックで埋まる | □ |
| TC-058 | SetBlock（ブロック設置） | `[ボタン] → [SetBlock: position/block を設定]` | 指定座標にブロックが置かれる | □ |
| TC-059 | SendMessage（メッセージ送信） | `[ボタン] → [SendMessage: "Hello"]` | MC チャットに "Hello" と表示される | □ |
| TC-060 | GetTopSolidBlock（最上部ブロック取得） | — | `[ボタン] → [GetTopSolidBlock: x/z を設定] → [SendMessage]` で y 座標が表示 | □ |
| TC-061 | WorldQuery（ワールド情報取得） | — | `[ボタン] → [WorldQuery: 項目選択] → [SendMessage]` で値が表示 | □ |
| TC-062 | BroadcastCommand（全員コマンド実行） | 複数プレイヤー接続 | `[ボタン] → [BroadcastCommand: "give @a apple 1"]` | 全員にリンゴが渡る | □ |
| TC-063 | BroadcastMessage（全員メッセージ） | 複数プレイヤー接続 | `[ボタン] → [BroadcastMessage: "Hello All"]` | 全員のチャットに表示 | □ |

---

## 7. プレイヤーコマンド系

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-071 | GetLocalPlayer（ローカルプレイヤー取得） | `[ボタン] → [GetLocalPlayer] → [SendMessage: "{player}"]` | プレイヤー名が表示 | □ |
| TC-072 | GetPlayerLocation（座標取得） | `[ボタン] → [GetPlayerLocation] → [SendMessage]` | x/y/z 座標が表示 | □ |
| TC-073 | GetPlayerOrientation（向き取得） | `[ボタン] → [GetPlayerOrientation] → [SendMessage]` | yaw/pitch が表示 | □ |
| TC-074 | GetGameMode（ゲームモード取得） | `[ボタン] → [GetGameMode] → [SendMessage]` | "creative" / "survival" 等が表示 | □ |
| TC-075 | SetGameMode（ゲームモード設定） | `[ボタン] → [SetGameMode: "survival"]` | サバイバルモードになる | □ |
| TC-076 | GiveItem（アイテム付与） | `[ボタン] → [GiveItem: "apple" / count: 5]` | インベントリにリンゴ5個が追加される | □ |
| TC-077 | GetPlayerTags（タグ取得） | プレイヤーに `/tag @s add test` を実行済み | `[ボタン] → [GetPlayerTags] → [SendMessage]` で ["test"] が表示 | □ |
| TC-078 | PlayerHasTag（タグ判定） | プレイヤーに "test" タグがある | `[ボタン] → [PlayerHasTag: "test"] → [SendMessage]` で true が表示 | □ |
| TC-079 | GetPlayerLevel（レベル取得） | — | `[ボタン] → [GetPlayerLevel] → [SendMessage]` で数値が表示 | □ |
| TC-080 | AddPlayerLevel（レベル加算） | `[ボタン] → [AddPlayerLevel: 5]` | 経験値レベルが5増える | □ |
| TC-081 | GetPlayerAbilities（アビリティ取得） | — | `[ボタン] → [GetPlayerAbilities] → [SendMessage]` でオブジェクトが表示 | □ |
| TC-082 | UpdateAbility（アビリティ更新） | `[ボタン] → [UpdateAbility: "mayfly" / true]` | フライが有効になる | □ |
| TC-083 | GetPlayers（プレイヤー一覧） | 複数接続 | `[ボタン] → [GetPlayers] → [SendMessage]` でプレイヤー名一覧が表示 | □ |
| TC-084 | SetTitle（タイトル表示） | `[ボタン] → [SetTitle: "テスト"]` | 画面中央に "テスト" と大きく表示 | □ |
| TC-085 | SetActionBar（アクションバー） | `[ボタン] → [SetActionBar: "HP: 100"]` | ホットバー上に "HP: 100" と表示 | □ |
| TC-086 | ClearTitle（タイトル消去） | TC-084 の後に実行 | タイトルが消える | □ |

---

## 8. 情報取得系（GetFrom*）

**共通前提：** 対応するイベントノードから player / block / item / mob スナップショットを受け取る  
**共通フロー：** `[OnXxx: player/block 等] → [GetFromXxx: フィールド選択] → [SendMessage]`

| ID | ノード | テスト方法 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-091 | GetFromPlayerSnapshot | OnPlayerChat の player → GetFromPlayerSnapshot で "name" を選択 | プレイヤー名が表示 | □ |
| TC-092 | GetFromEntity | OnPlayerChat の player → GetFromEntity で "id" を選択 | エンティティ ID が表示 | □ |
| TC-093 | GetFromBlockType | OnBlockBroken の block → GetFromBlockType で "id" を選択 | ブロック ID（例: "minecraft:stone"）が表示 | □ |
| TC-094 | GetFromItemType | OnItemAcquired の item → GetFromItemType で "id" を選択 | アイテム ID が表示 | □ |
| TC-095 | GetFromItemStack | OnItemAcquired の item → GetFromItemStack で "amount" を選択 | 個数が表示 | □ |
| TC-096 | GetFromMob | OnMobInteracted の mob → GetFromMob で "type" を選択 | モブ種別（例: "minecraft:cow"）が表示 | □ |
| TC-097 | GetFromVillager | OnItemTraded の villager → GetFromVillager で "profession" を選択 | 職業が表示 | □ |
| TC-098 | GetFromScoreboardObjective | TC-121 でスコアボード作成後、objective → GetFromScoreboardObjective で "id" を選択 | スコアボード名が表示 | □ |

---

## 9. セレクター / コンバーター系

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-101 | Selector（ID 選択） | `[Selector: ブロック/アイテム/モブ カテゴリ選択] → [RunCommand: "give @a {id} 1"]` のように接続 | プルダウンで ID が選択できる。接続先で正しい ID 文字列が使われる | □ |
| TC-102 | LocaleName（ロケール名変換） | `[OnBlockBroken: blockId] → [LocaleName] → [SendMessage]` | ブロック ID が日本語名（例: "石"）に変換されて表示 | □ |

---

## 10. 数学・座標系

**共通前提：** MC への接続不要（純粋関数。Flyde 上で入力値を設定して出力を確認）

| ID | ノード | 設定値 | 期待される出力 | 結果 |
|---|---|---|---|---|
| TC-111 | Vector3Op（座標演算） | a: `{x:1,y:2,z:3}` / b: `{x:4,y:5,z:6}` / op: add | `{x:5, y:7, z:9}` | □ |
| TC-112 | Vector3Op（減算） | a: `{x:5,y:7,z:9}` / b: `{x:1,y:2,z:3}` / op: subtract | `{x:4, y:5, z:6}` | □ |
| TC-113 | Vector3ToString（文字列変換） | v: `{x:1,y:64,z:-3}` | `"1 64 -3"` | □ |
| TC-114 | Vector3Split（分解） | v: `{x:10,y:20,z:30}` | x=10 / y=20 / z=30 | □ |
| TC-115 | Vector3Distance（距離計算） | a: `{x:0,y:0,z:0}` / b: `{x:3,y:4,z:0}` | `5`（3-4-5 三角形） | □ |
| TC-116 | ClampNumber（値クランプ） | value: 150 / min: 0 / max: 100 | `100` | □ |
| TC-117 | ClampNumber（範囲内） | value: 50 / min: 0 / max: 100 | `50` | □ |
| TC-118 | Vector3Normalize（正規化） | v: `{x:3,y:0,z:0}` | `{x:1, y:0, z:0}` | □ |
| TC-119 | Vector3Dot（内積） | a: `{x:1,y:0,z:0}` / b: `{x:1,y:0,z:0}` | `1` | □ |
| TC-120 | Vector3Lerp（線形補間） | a: `{x:0,y:0,z:0}` / b: `{x:10,y:0,z:0}` / t: 0.5 | `{x:5, y:0, z:0}` | □ |
| TC-121 | AABBCreate（AABB 作成） | min: `{x:0,y:0,z:0}` / max: `{x:5,y:5,z:5}` | AABB オブジェクトが出力される | □ |
| TC-122 | AABBIsInside（内包判定） | aabb: TC-121 の出力 / point: `{x:2,y:2,z:2}` | `true` | □ |
| TC-123 | AABBIsInside（範囲外） | aabb: TC-121 の出力 / point: `{x:10,y:10,z:10}` | `false` | □ |
| TC-124 | AABBTranslate（移動） | aabb: TC-121 の出力 / offset: `{x:5,y:0,z:0}` | min が `{x:5,y:0,z:0}` / max が `{x:10,y:5,z:5}` | □ |
| TC-125 | AABBIntersects（交差判定） | aabb1: 0-5 / aabb2: 3-8 | `true`（重なっている） | □ |

---

## 11. エージェント系

**共通前提：** Education Edition モードを有効化 → `/summon agent` でエージェントを召喚済み

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-131 | GetAgentLocation（位置取得） | `[ボタン] → [GetAgentLocation] → [SendMessage]` | エージェントの座標が表示 | □ |
| TC-132 | AgentMove（移動） | `[ボタン] → [AgentMove: direction="forward" / steps=1]` | エージェントが前に1マス移動 | □ |
| TC-133 | AgentTurn（回転） | `[ボタン] → [AgentTurn: direction="left"]` | エージェントが左に向く | □ |
| TC-134 | AgentTeleport（テレポート） | `[ボタン] → [AgentTeleport: プレイヤー位置を設定]` | エージェントが指定座標に移動 | □ |
| TC-135 | AgentDetect（障害物検知） | エージェントの前にブロックを置く | `[ボタン] → [AgentDetect: direction="forward"] → [SendMessage]` で `true` | □ |
| TC-136 | AgentInspect（ブロック調査） | エージェントの前にブロックを置く | `[ボタン] → [AgentInspect: direction="forward"] → [SendMessage]` でブロック名表示 | □ |
| TC-137 | AgentPlaceBlock（ブロック設置） | エージェントのスロット1にブロックをセット済み | `[ボタン] → [AgentPlaceBlock: direction="forward" / slot=1]` | 前にブロックが置かれる | □ |
| TC-138 | AgentAction（アクション） | — | `[ボタン] → [AgentAction: action="attack"]` | エージェントが攻撃アクション | □ |
| TC-139 | AgentCollect（アイテム収集） | 近くにドロップアイテムがある | `[ボタン] → [AgentCollect: "apple"]` | エージェントがリンゴを拾う | □ |
| TC-140 | AgentDropItem（アイテムドロップ） | エージェントのスロット1にアイテムがある | `[ボタン] → [AgentDropItem: slot=1 / count=1]` | アイテムがドロップされる | □ |
| TC-141 | AgentGetItemCount（アイテム個数取得） | エージェントのスロット1にアイテムがある | `[ボタン] → [AgentGetItemCount: slot=1] → [SendMessage]` | 個数が表示 | □ |
| TC-142 | AgentGetItemSpace（空きスペース取得） | — | `[ボタン] → [AgentGetItemSpace: slot=1] → [SendMessage]` | 空きスペース数が表示 | □ |
| TC-143 | AgentGetItemDetail（アイテム詳細） | エージェントのスロット1にアイテムがある | `[ボタン] → [AgentGetItemDetail: slot=1] → [SendMessage]` | アイテム名/個数/損傷値が表示 | □ |
| TC-144 | AgentMoveItem（アイテム移動） | スロット1にアイテムがある | `[ボタン] → [AgentMoveItem: fromSlot=1 / toSlot=2 / count=1]` | スロット2にアイテムが移動 | □ |
| TC-145 | AgentSetItem（アイテムセット） | — | `[ボタン] → [AgentSetItem: item="apple" / count=5 / slot=1]` | スロット1にリンゴ5個がセット | □ |

---

## 12. スコアボード系

**共通前提：** MC に接続済み

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-151 | AddScoreboardObjective（追加） | `[ボタン] → [AddScoreboardObjective: id="test" / displayName="テスト"]` | `/scoreboard objectives list` で "test" が確認できる | □ |
| TC-152 | GetScoreboardObjectives（一覧取得） | TC-151 の後に `[ボタン] → [GetScoreboardObjectives] → [SendMessage]` | スコアボード名一覧が表示 | □ |
| TC-153 | GetScoreboardObjective（単体取得） | `[ボタン] → [GetScoreboardObjective: "test"] → [SendMessage]` | スコアボードオブジェクトが表示 | □ |
| TC-154 | ScoreOperation（スコア操作） | `[ボタン] → [ScoreOperation: player="@s" / objective="test" / op="=" / value=100]` | `/scoreboard players list @s` で score=100 | □ |
| TC-155 | GetScores（全スコア取得） | TC-154 の後に `[ボタン] → [GetScores: "test"] → [SendMessage]` | プレイヤーとスコアの一覧が表示 | □ |
| TC-156 | GetScore（単一取得） | `[ボタン] → [GetScore: player="@s" / objective="test"] → [SendMessage]` | `100` が表示 | □ |
| TC-157 | RemoveScoreboardObjective（削除） | `[ボタン] → [RemoveScoreboardObjective: "test"]` | `/scoreboard objectives list` から "test" が消える | □ |

---

## 13. ビルド・言語切替テスト

MC との接続不要。ターミナルで実行。

| ID | テスト内容 | 手順 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-161 | 型チェック | `npm run typecheck` | エラーなしで完了 | □ |
| TC-162 | 無料版ビルド | `npm run build` | `dist/index.free.flyde.js` が生成される | □ |
| TC-163 | フル版ビルド | `node scripts/build.js --full` | `dist/index.flyde.js` が生成される | □ |
| TC-164 | 英語切替 | `npm run lang:en` | 3ファイルが en_US に書き換わる / Flyde リロード後ノード名が英語になる | □ |
| TC-165 | 日本語切替 | `npm run lang:ja` | 3ファイルが ja_JP に書き換わる / Flyde リロード後ノード名が日本語になる | □ |

---

## テスト結果サマリー

| カテゴリ | 件数 | Pass | Fail | 未実施 |
|---|---|---|---|---|
| 1. 接続系 | 2 | | | |
| 2. プレイヤーイベント系 | 9 | | | |
| 3. ブロックイベント系 | 2 | | | |
| 4. アイテムイベント系 | 6 | | | |
| 5. モブイベント系 | 2 | | | |
| 6. ゲームプレイコマンド系 | 13 | | | |
| 7. プレイヤーコマンド系 | 16 | | | |
| 8. 情報取得系 | 8 | | | |
| 9. セレクター/コンバーター系 | 2 | | | |
| 10. 数学・座標系 | 15 | | | |
| 11. エージェント系 | 15 | | | |
| 12. スコアボード系 | 7 | | | |
| 13. ビルド・言語切替 | 5 | | | |
| **合計** | **102** | | | |
