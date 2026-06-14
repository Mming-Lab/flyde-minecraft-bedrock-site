# テスト仕様書

対象：フル版（`index.flyde.ts`）全ノード  
更新日：2026-06-15（TC-014/021/022/031/033/035/041/042/054/061/064/077/081 PASS 反映、BroadcastMessage → JSONStringify+RunCommand 移行）

---

## テスト環境

### 必要なもの

- Minecraft 統合版（Windows PC 推奨）
- VSCode + Flyde 拡張機能
- Creative モードのワールド（コマンド実行権限あり）
- エージェント系テスト用：Education Edition モードを有効にしてエージェントを召喚しておく

---

## テスト実行手順

### A. npm link テスト（推奨）

npm 版・zip 版ともに `dist/` を使う構成に統一されているため、`npm link` で同じ環境が再現できる。

#### 1. ビルド

```bash
# flyde-minecraft-bedrock リポジトリで実行
npm run build:full   # dist/index.flyde.js を生成
```

#### 2. テスト環境を作成

```bash
# flyde-minecraft-bedrock をグローバルにリンク登録
cd flyde-minecraft-bedrock
npm link

# テスト用フォルダを作成
mkdir flyde-mc-test
cd flyde-mc-test
```

`flyde-mc-test/package.json` を作成：

```json
{
  "name": "flyde-mc-test",
  "version": "1.0.0",
  "dependencies": {
    "flyde-minecraft-bedrock": "*"
  }
}
```

```bash
# リンクを接続 + テストフローをコピー
npm link flyde-minecraft-bedrock
mkdir -p flows/tests
copy ..\flyde-minecraft-bedrock\flows\tests\*.flyde flows\tests\
```

#### 3. VSCode でテスト環境を開く

```
flyde-mc-test/ を VSCode で開く
flows/tests/test-XX-*.flyde を開いてフロー実行
```

#### 4. Minecraft に接続してテスト実行

1. フローを実行（SocketBE が localhost:8080 で起動）
2. Minecraft で `/connect localhost:8080`
3. 接続メッセージを確認
4. 自動テストの場合：チャットでメッセージ送信 → ログで PASS/FAIL 確認

---

### B. npm pack テスト（リリース前最終確認）

実際に publish される `.tgz` をインストールしてテストする：

```bash
cd flyde-minecraft-bedrock
npm run build:full
npm pack   # → flyde-minecraft-bedrock-x.x.x.tgz を生成

cd flyde-mc-test
npm install ../flyde-minecraft-bedrock/flyde-minecraft-bedrock-x.x.x.tgz
```

---

### 自動テストの結果確認

`logs/flyde-mc-YYYY-MM-DD_HH-mm-ss_N.log` を確認：

```
[INFO] [[TC-052]] PASS
[INFO] [[TC-056]] PASS
[INFO] [[TC-057]] FAIL  ← 失敗の場合
```

---

### フロー表記の読み方

```
[ノードA] → [ノードB]          # ノードAの出力をノードBに接続
[ノードA: 設定値]              # ノードAに値を設定
[SendMessage: "{変数}"]       # 変数の内容をチャットに表示して確認
```

---

## 1. 接続系

**テストフロー：** `flows/tests/test-01-connection.flyde` を開いてフロー実行 → 目視確認  

| ID | ノード | フロー構成 | Minecraft での操作 | 確認内容 | 結果 |
|---|---|---|---|---|---|
| TC-001 | MinecraftConnect | test-01: MinecraftConnect 起動 | `/connect localhost:8080` | WSサーバー起動メッセージ / Minecraft 接続成功メッセージ（目視確認） | ✓ |
| TC-002 | MinecraftDisconnect | test-01: チャット送信 → MinecraftDisconnect | チャットを送信 | MC との接続が切れる（目視確認） | ✓ |

---

## 2. プレイヤーイベント系

**テストフロー：** `flows/tests/test-02-player-events.flyde` を開いてフロー実行 → **チャット 1 回送信**で TC-013/017/018 も自動テスト  
**TC-012/013/014/017/018/019 はログで PASS/FAIL を確認、TC-011/015/016 は MCチャットに結果が表示される**

| ID | ノード | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-011 | OnPlayerChat（チャット受信時） | MC でチャットメッセージを送信 | 送信者名・内容が MCチャットに表示される（目視確認） | □ |
| TC-012 | OnPlayerTravelled（プレイヤー移動時） | MC でプレイヤーを歩かせる | Assert(移動距離 > 0) → ログで PASS 確認 | ✓ |
| TC-013 | OnPlayerTeleported（テレポート時） | チャット送信（RunCommand が自動で `/tp` 実行） | Assert(テレポート原因 neq "") → ログで PASS 確認 | ✓ |
| TC-014 | OnPlayerBounced（バウンド時） | MC でスライムブロックの上でジャンプ | Assert(高さ >= 0) → ログで PASS 確認 | ✓ |
| TC-015 | OnPlayerJoin（プレイヤー参加時） | 別のプレイヤーがワールドに参加 | プレイヤー名が MCチャットに表示される（目視確認） | □ |
| TC-016 | OnPlayerLeave（プレイヤー退出時） | 別のプレイヤーがワールドを退出 | プレイヤー名が MCチャットに表示される（目視確認） | □ |
| TC-017 | OnPlayerTitle（タイトル受信時） | チャット送信（RunCommand が自動で `/title` 実行） | Assert(メッセージ neq "") → ログで PASS 確認 | ✓ |
| TC-018 | OnPlayerMessage（メッセージ受信時） | チャット送信（RunCommand が自動で `/tell` 実行） | Assert(メッセージ neq "") → ログで PASS 確認 | ✓ |
| TC-019 | OnPlayerTransform（プレイヤー位置変化時） | MC でプレイヤーを移動させる | Assert(座標.y >= -64) → ログで PASS 確認 | ✓ |

---

## 3. ブロックイベント系

**テストフロー：** `flows/tests/test-03-block-events.flyde` を開いてフロー実行 → 各操作でイベントを発火させる  
**TC-093 はログで PASS/FAIL を確認、他は MCチャットに結果が表示される**

| ID | ノード | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-021 | OnBlockBroken（ブロック破壊時） | MC でブロックを壊す | 破壊方法が MCチャットに表示される | ✓ |
| TC-022 | OnBlockPlaced（ブロック設置時） | MC でブロックを置く | 設置方法とブロック名が MCチャットに表示される | ✓ |

---

## 4. アイテムイベント系

**テストフロー：** `flows/tests/test-04-item-events.flyde` を開いてフロー実行 → 各操作でイベントを発火させる  
**TC-032/094/095 はログで PASS/FAIL を確認、他は MCチャットに結果が表示される**

| ID | ノード | 前提 | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|---|
| TC-031 | OnItemInteracted（アイテム使用時） | 使えるアイテムを持つ | アイテムを右クリック | 使用方法が MCチャットに表示される | ✓ |
| TC-032 | OnItemAcquired（アイテム取得時） | — | ブロックを壊してドロップを拾う | Assert(個数 > 0) → ログで PASS 確認 | ✓ |
| TC-033 | OnItemCrafted（クラフト時） | 材料を持つ | クラフトテーブルでアイテムを作る | Assert(GetFromItemStack.アイテムID != "") → ログで PASS (TC-095) | ✓ |
| TC-034 | OnItemEquipped（アイテム装備時） | 装備できるアイテムを持つ | 防具・ツールをホットバーに持つ | 装備スロットが MCチャットに表示される | □ |
| TC-035 | OnItemSmelted（精錬時） | かまど + 精錬できる素材を持つ | かまどで精錬が完了する | 燃料が MCチャットに表示される | ✓ |
| TC-036 | OnItemTraded（取引時） | 村人の近く | 村人と取引する | プレイヤーEM数・村人名が MCチャットに表示される | □ |

---

## 5. モブイベント系

**テストフロー：** `flows/tests/test-05-mob-events.flyde` を開いてフロー実行 → 各操作でイベントを発火させる  
**TC-042/096 はログで PASS/FAIL を確認、TC-041 は MCチャットに結果が表示される**  
**注意：** WorldMob にはIDや名前フィールドがないため、GetFromMob は種別番号（数値）のみ出力

| ID | ノード | 前提 | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|---|
| TC-041 | OnMobInteracted（モブ交流時） | 動物（ウシ・ニワトリ等）の近く | モブを右クリック | 交流種別が MCチャットに表示される | ✓ |
| TC-042 | OnTargetBlockHit（的命中時） | 的ブロックを設置する | 矢を的に当てる | Assert(強さ 0〜15) → ログで PASS 確認 | ✓ |

---

## 6. ゲームプレイコマンド系

**共通前提：** MC に接続済み  
**自動テスト（TC-052〜TC-059）：** `flows/tests/test-06-gameplay.flyde` を開いてフロー実行 → チャット送信1回で自動実行  
**自動テスト（TC-051/060/064）：** `flows/tests/test-06b-gameplay2.flyde` を開いてフロー実行 → チャット送信1回で自動実行  
**TC-054/061：** `flows/tests/test-06c-gameplay3.flyde` を開いてフロー実行 → チャット送信1回（TC-054は自動+目視、TC-061は目視確認）

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-051 | RunCommand（コマンド実行） | 自動テスト：RunCommand("time set day") → 完了 = true を確認 | 完了が true で返る | ✓ |
| TC-052 | GetGameTime | 自動テスト：RunCommand("time set 6000") → GetGameTime の戻り値 ≈ 6000 を確認（許容差500） | 設定した時刻が正しく取得できる | ✓ |
| TC-053 | IsDaytime（昼判定） | 自動テスト：RunCommand("time set 6000") 後に IsDaytime = true を確認 | 昼時刻（6000）で true が返る | ✓ |
| TC-054 | GetWeather（天気取得） | test-06c: チャット送信 → Assert(天気 neq "") + MCチャットに天気名を表示 | Assert(天気 neq "") → ログで PASS 確認 + 目視で天気名確認 | ✓ |
| TC-056 | GetWeather（雨確認） | 自動テスト：RunCommand("weather rain") → GetWeather = "Rain" を確認 | 雨設定後すぐ天気が "Rain" になる | ✓ |
| TC-057 | GetWeather（晴れ確認） | 自動テスト：RunCommand("weather clear") → GetWeather = "Clear" を確認 | Clear 設定後 "Clear" が返る | ✓ |
| TC-058 | GetGameMode（Creative確認） | 自動テスト：RunCommand("gamemode creative") → GetGameMode = "Creative" を確認 | Creative 設定後 "Creative" が返る | ✓ |
| TC-059 | GetGameMode（Survival確認） | 自動テスト：RunCommand("gamemode survival") → GetGameMode = "Survival" を確認 | Survival 設定後 "Survival" が返る | ✓ |
| TC-060 | GetTopSolidBlock（最上部ブロック取得） | 自動テスト：GetTopSolidBlock → 座標.y >= -64 を確認 | y 座標が -64 以上（有効範囲内）で返る | ✓ |
| TC-061 | WorldQuery（ワールド情報取得） | test-06c: チャット送信 → WorldQuery(mob/block/item) × 3 種別が例外なく完了する | ログに ERROR なし＋ OUT[一覧] にデータが返る（大量データのため say 表示なし） | ✓ |
| TC-064 | FillBlocks（エリア塗りつぶし） | 自動テスト：setblock(0,30,0,dirt) → FillBlocks({0,30,0}〜{0,30,0}, air) → 個数 = 1 を確認 | fillCount が数値で返る | ✓ |

---

## 7. プレイヤーコマンド系

**自動テスト（TC-071,TC-072,TC-079）：** `flows/tests/test-07a-player-query.flyde` を開いてフロー実行 → チャット送信1回で自動実行  
**自動テスト（TC-073,TC-078,TC-083）：** `flows/tests/test-07c-player-misc.flyde` を開いてフロー実行 → チャット送信1回で自動実行  
**手動テスト（TC-077,TC-081）：** `flows/tests/test-07d-player-query3.flyde` を開いてフロー実行 → チャット送信でトリガー → MCチャットに結果表示（目視確認）

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-071 | GetLocalPlayer（ローカルプレイヤー取得） | 自動テスト：GetLocalPlayer → GetFromPlayerSnapshot.name = チャット送信者名 を確認 | プレイヤー名が一致する | ✓ |
| TC-072 | GetPlayerLocation（座標取得） | 自動テスト：GetPlayerLocation → 座標.y >= -64 を確認 | y 座標が有効範囲内で返る | ✓ |
| TC-073 | GetPlayerOrientation（向き取得） | 自動テスト：GetPlayerOrientation → 角度 >= -180 を確認（数値で返ることを確認） | yaw 角度が -180 以上の数値で返る | ✓ |
| TC-077 | GetPlayerTags（タグ取得） | — | test-07d: チャット送信 → タグ一覧が MCチャットに表示される | ✓ |
| TC-078 | PlayerHasTag（タグ判定） | 自動テスト（test-07d）：tag add → PlayerHasTag("__flyde_test__") = true を Assert（正常系） | タグ付与後に true が返る | □ |
| TC-079 | GetPlayerLevel（レベル取得） | 自動テスト：GetPlayerLevel → レベル >= 0 を確認 | レベルが 0 以上の数値で返る | ✓ |
| TC-081 | GetPlayerAbilities（アビリティ取得） | — | test-07d: チャット送信 → アビリティオブジェクトが MCチャットに表示される | ✓ |
| TC-083 | GetPlayers（プレイヤー一覧） | 自動テスト：GetPlayers → Assert(プレイヤー数 >= 0) を確認 | プレイヤー配列が例外なく返る | □ |

---

## 8. 情報取得系（GetFrom*）

**共通前提：** 対応するイベントノードから player / block / item / mob スナップショットを受け取る  
**自動テスト（TC-091,TC-092）：** `flows/tests/test-08-info.flyde` を開いてフロー実行 → チャット送信1回で自動実行  
**TC-093** は `test-03-block-events.flyde` の OnBlockBroken → GetFromBlockType → Assert でログ確認  
**TC-094/095** は `test-04-item-events.flyde` の各イベント → GetFromItemType/Stack → Assert でログ確認  
**TC-096** は `test-05-mob-events.flyde` の OnMobInteracted → GetFromMob → Assert でログ確認  
**TC-097** は `test-04-item-events.flyde` の OnItemTraded → GetFromVillager → MCチャット表示（目視確認）

| ID | ノード | テスト方法 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-091 | GetFromPlayerSnapshot | 自動テスト：GetLocalPlayer → GetFromPlayerSnapshot.name = チャット送信者名 を確認 | プレイヤー名が一致する | □ |
| TC-092 | GetFromEntity | 自動テスト：GetLocalPlayer → GetFromPlayerSnapshot.entity → GetFromEntity.ID >= 0 を確認 | エンティティ ID が 0 以上の数値で返る | □ |
| TC-093 | GetFromBlockType | test-03: OnBlockBroken → GetFromBlockType.ブロックID != "" を Assert | ブロック ID が空でない文字列で返る | ✓ |
| TC-094 | GetFromItemType | test-04: OnItemAcquired → GetFromItemType.アイテムID != "" を Assert | アイテム ID が空でない文字列で返る | ✓ |
| TC-095 | GetFromItemStack | test-04: OnItemCrafted → GetFromItemStack.アイテムID != "" を Assert | アイテム ID が空でない文字列で返る | ✓ |
| TC-096 | GetFromMob | test-05: OnMobInteracted → GetFromMob.種別 >= 0 を Assert（WorldMob は数値のみ） | 種別番号が 0 以上の数値で返る | ✓ |
| TC-097 | GetFromVillager | test-04: OnItemTraded → GetFromVillager.名前 → MCチャットに表示（目視確認） | 村人名が表示される | □ |
| TC-098 | GetFromScoreboardObjective | スコアボード目標作成後、objective → GetFromScoreboardObjective で id を確認 | スコアボード名が表示（TC-151 で自動確認済み） | ✓ |

---

## 9. セレクター / コンバーター系

**自動テスト（TC-101,TC-102）：** `flows/tests/test-09-selectors.flyde` を開いてフロー実行 → MC 接続不要・ログで PASS/FAIL 確認

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-101 | Selector（ID 選択） | 自動テスト：Selector(block, minecraft:grass_block) → 値 = "minecraft:grass_block" を確認 | 選択したブロック ID が正しく出力される | □ |
| TC-102 | LocaleName（ロケール名変換） | 自動テスト：LocaleName("minecraft:grass_block", block) → 日本語名 = "草ブロック" を確認 | ブロック ID が日本語名に変換される | □ |

---

## 10. 数学・座標系

**共通前提：** MC への接続不要（純粋関数）  
**自動テスト：** `flows/tests/test-10-math.flyde` を開いてフロー実行 → `logs/` のログで PASS/FAIL 確認

| ID | ノード | 設定値 | 期待される出力 | 結果 |
|---|---|---|---|---|
| TC-111 | Vector3Op（add） | 座標A:`{1,2,3}` / 座標B:`{4,5,6}` / 演算:add | `{x:5,y:7,z:9}` | ✓ |
| TC-112 | Vector3Op（subtract） | 座標A:`{5,7,9}` / 座標B:`{1,2,3}` / 演算:subtract | `{x:4,y:5,z:6}` | ✓ |
| TC-113 | Vector3Op（scale） | 座標:`{2,4,6}` / 倍率:3 / 演算:scale | `{x:6,y:12,z:18}` | ✓ |
| TC-114 | Vector3Op（assemble） | x:10 / y:20 / z:30 / 演算:assemble | `{x:10,y:20,z:30}` | ✓ |
| TC-115 | Vector3Op（floor） | 座標:`{1.7,2.3,3.9}` / 演算:floor | `{x:1,y:2,z:3}` | ✓ |
| TC-116 | Vector3Op（fill_y） | 座標XZ:`{x:5,z:10}` / Y:64 / 演算:fill_y | `{x:5,y:64,z:10}` | ✓ |
| TC-117 | Vector3Distance | 座標A:`{0,0,0}` / 座標B:`{3,4,0}` | `5`（3-4-5 三角形） | ✓ |
| TC-118 | Vector3ToString | 座標:`{1,64,-3}` | `"1 64 -3"` | ✓ |
| TC-119 | Vector3Split | 座標:`{10,20,30}` | x=10 / y=20 / z=30（3つ同時確認） | ✓ |
| TC-120a | ClampNumber（上限超え） | 値:150 / 最小:0 / 最大:100 | `100` | ✓ |
| TC-120b | ClampNumber（下限超え） | 値:-10 / 最小:0 / 最大:100 | `0` | ✓ |
| TC-120c | ClampNumber（範囲内） | 値:50 / 最小:0 / 最大:100 | `50` | ✓ |
| TC-121 | AABBCreate | 角座標A:`{0,0,0}` / 角座標B:`{5,5,5}` | `{min:{0,0,0},max:{5,5,5}}` | ✓ |
| TC-122a | AABBIsInside（内部） | エリア:0-5 / 座標:`{2,2,2}` | `true` | ✓ |
| TC-122b | AABBIsInside（外部） | エリア:0-5 / 座標:`{10,10,10}` | `false` | ✓ |
| TC-123 | AABBTranslate | エリア:0-5 / 移動量:`{5,0,0}` | `{min:{5,0,0},max:{10,5,5}}` | ✓ |
| TC-124a | AABBIntersects（重複あり） | エリアA:0-5 / エリアB:3-8 | `true` | ✓ |
| TC-124b | AABBIntersects（重複なし） | エリアA:0-3 / エリアB:5-8 | `false` | ✓ |
| TC-125 | Vector3Lerp | 座標A:`{0,0,0}` / 座標B:`{10,0,0}` / t:0.5 | `{x:5,y:0,z:0}` | ✓ |
| TC-126 | Vector3Normalize | 座標:`{3,0,0}` | `{x:1,y:0,z:0}` | ✓ |
| TC-127a | Vector3Dot（直交） | 座標A:`{1,0,0}` / 座標B:`{0,1,0}` | `0` | ✓ |
| TC-127b | Vector3Dot（平行） | 座標A:`{1,0,0}` / 座標B:`{1,0,0}` | `1` | ✓ |

---

## 11. エージェント系

**テストフロー：** `flows/tests/test-11-agents.flyde` を開いて **2回実行**  
**共通前提：** Education Edition モードを有効化（エージェントが存在しなければ自動作成される）  
**1回目：** チャット送信 → TC-131/132 が自動実行（AgentTP → GetAgentLocation）  
**2回目：** フロー再起動 → TC-133〜145 が起動時に自動実行（前回のコンテキストを process から再利用）  
**TC-131〜135/138〜140/142〜145 はログで PASS/FAIL を確認、TC-136/137/141 はMCチャットに表示**

| ID | ノード | 操作 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-131 | AgentTeleport（テレポート） | チャット送信でトリガー | Assert(完了 = true) → ログで PASS 確認 | □ |
| TC-132 | GetAgentLocation（位置取得） | TC-131 の完了後に自動実行 | Assert(座標.y >= -64) → ログで PASS 確認 | □ |
| TC-133 | AgentMove（移動） | TC-132 の完了後に自動実行 | Assert(完了 = true) → ログで PASS 確認 | □ |
| TC-134 | AgentTurn（回転） | TC-133 の完了後に自動実行 | Assert(完了 = true) → ログで PASS 確認 | □ |
| TC-135 | AgentAction（攻撃） | TC-134 の完了後に自動実行 | Assert(完了 = true) → ログで PASS 確認 | □ |
| TC-136 | AgentDetect（障害物検知） | TC-135 の完了後に自動実行 | 検知結果（true/false）が MCチャットに表示（目視確認） | □ |
| TC-137 | AgentInspect（ブロック調査） | TC-136 の完了後に自動実行 | 前方ブロックIDが MCチャットに表示（目視確認） | □ |
| TC-138 | AgentSetItem（アイテムセット） | TC-137 の完了後に自動実行 | Assert(完了 = true)、スロット1に minecraft:stone 5個 | □ |
| TC-139 | AgentGetItemCount（アイテム個数取得） | TC-138 の完了後に自動実行 | Assert(個数 > 0) → ログで PASS 確認 | □ |
| TC-140 | AgentGetItemSpace（空きスペース取得） | TC-139 の完了後に自動実行 | Assert(空き >= 0) → ログで PASS 確認 | □ |
| TC-141 | AgentGetItemDetail（アイテム詳細） | TC-140 の完了後に自動実行 | スロット1のアイテムIDが MCチャットに表示（目視確認） | □ |
| TC-142 | AgentMoveItem（アイテム移動） | TC-141 の完了後に自動実行 | Assert(完了 = true)、スロット1→2に移動 | □ |
| TC-143 | AgentPlaceBlock（ブロック設置） | TC-142 の完了後に自動実行 | Assert(完了 = true)、スロット2のブロックを前に設置 | □ |
| TC-144 | AgentDropItem（アイテムドロップ） | TC-143 の完了後に自動実行 | Assert(完了 = true)、スロット1から前にドロップ | □ |
| TC-145 | AgentAction（ブロック破壊） | TC-144 の完了後に自動実行 | Assert(完了 = true) → ログで PASS 確認後 MinecraftDisconnect | □ |

---

## 12. スコアボード系

**共通前提：** MC に接続済み  
**自動テスト（TC-154,TC-156,TC-157）：** `flows/tests/test-12a-scoreboard-ops.flyde` を開いてフロー実行 → チャット送信1回で自動実行（TC-SB02〜TC-SB05）  
**自動テスト（TC-151,TC-153）：** `flows/tests/test-12b-scoreboard-query.flyde` を開いてフロー実行

| ID | ノード | フロー構成 | 確認内容 | 結果 |
|---|---|---|---|---|
| TC-151 | AddScoreboardObjective（追加） | 自動テスト：AddScoreboardObjective("mcflowtest2") → GetFromScoreboardObjective → id = "mcflowtest2" を確認 | スコアボード目標を追加し、ID が正しく返る | □ |
| TC-152 | GetScoreboardObjectives（一覧取得） | 自動テスト（test-scoreboard2.flyde）：目標追加後 GetScoreboardObjectives → 目標一覧が返る（implicit） | 例外なく一覧が取得できる | □ |
| TC-153 | GetScoreboardObjective（単体取得） | 自動テスト：GetScoreboardObjective("mcflowtest2") → id = "mcflowtest2" を確認 | 指定IDの目標が取得できる | □ |
| TC-154 | ScoreOperation（スコア操作） | 自動テスト（test-12a-scoreboard-ops.flyde）：set 42 → 新スコア=42（TC-SB02）、add 8 → 50（TC-SB04） | スコアの set/add が正しく動作する | ✓ |
| TC-155 | GetScores（全スコア取得） | 自動テスト（test-12b-scoreboard-query.flyde）：スコア設定後 GetScores → スコア一覧が返る（implicit） | 例外なく一覧が取得できる | □ |
| TC-156 | GetScore（単一取得） | 自動テスト（test-12a-scoreboard-ops.flyde）：set 42 後 GetScore → 42（TC-SB03） | スコアが正しく取得できる | ✓ |
| TC-157 | RemoveScoreboardObjective（削除） | 自動テスト（test-12a-scoreboard-ops.flyde）：RemoveScoreboardObjective → true（TC-SB05） | スコアボード目標を削除できる | ✓ |

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

| カテゴリ | 件数 | 自動テスト化(Assert) | 手動確認のみ |
|---|---|---|---|
| 1. 接続系 | 2 | 0 | 2 |
| 2. プレイヤーイベント系 | 9 | 6（TC-012/013/014/017/018/019） | 3 |
| 3. ブロックイベント系 | 2 | 0 | 2 |
| 4. アイテムイベント系 | 6 | 1（TC-032） | 5 |
| 5. モブイベント系 | 2 | 1（TC-042） | 1 |
| 6. ゲームプレイコマンド系 | 11 | 10（+TC-054） | 1 |
| 7. プレイヤーコマンド系 | 8 | 6 | 2 |
| 8. 情報取得系 | 8 | 6（TC-091/092/093/094/095/096） | 2 |
| 9. セレクター/コンバーター系 | 2 | 2 | 0 |
| 10. 数学・座標系 | 22 | 22 | 0 |
| 11. エージェント系 | 15 | 12（TC-131〜135/138/139/140/142〜145） | 3 |
| 12. スコアボード系 | 7 | 7 | 0 |
| 13. ビルド・言語切替 | 5 | 0 | 5 |
| **合計** | **99** | **73（74%）** | **26** |

> **テストフロー一覧**
>
> **自動テスト（Assert → ログで PASS/FAIL 確認）**
> | フロー | テスト対象 |
> |---|---|
> | test-06-gameplay.flyde | TC-052/053/056/057/058/059 |
> | test-06b-gameplay2.flyde | TC-051/060/064 |
> | test-07a-player-query.flyde | TC-071/072/079 |
> | test-07c-player-misc.flyde | TC-073/078/083 |
> | test-08-info.flyde | TC-091/092 |
> | test-09-selectors.flyde | TC-101/102（MC 接続不要） |
> | test-10-math.flyde | TC-111〜127（MC 接続不要） |
> | test-12a-scoreboard-ops.flyde | TC-SB02/SB03/SB04/SB05 |
> | test-12b-scoreboard-query.flyde | TC-151/152/153/155 |
>
> **手動イベントテスト（ユーザーがイベントを発火、一部 Assert あり）**
> | フロー | テスト対象 |
> |---|---|
> | test-01-connection.flyde | TC-001/002（目視確認のみ、Note ノードに手順記載） |
> | test-02-player-events.flyde | TC-011〜019（TC-012/013/014/017/018/019 は Assert、RunCommand で自動化） |
> | test-03-block-events.flyde | TC-021/022/093（TC-093 は Assert） |
> | test-04-item-events.flyde | TC-031〜036/094/095/097（TC-032/094/095 は Assert） |
> | test-05-mob-events.flyde | TC-041/042/096（TC-042/096 は Assert） |
> | test-06c-gameplay3.flyde | TC-054/061（TC-054 は Assert + 目視、TC-061 は目視確認） |
> | test-07d-player-query3.flyde | TC-077/081（チャット送信、MCチャット目視確認） |
> | test-11-agents.flyde | TC-131〜145（2回実行、TC-131〜135/138〜140/142〜145 は Assert） |
