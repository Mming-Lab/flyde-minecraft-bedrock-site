# テスト仕様書

更新日: 2026-06-19

---

## テストアーキテクチャ

### ファイル構成

| ファイル | 種別 | テストケース |
|---|---|---|
| `run-auto-all.flyde` | 全自動マスター | 全自動テストを順番に一括実行 |
| `auto-command.flyde` | 自動サブノード | TC-051〜064（コマンド・時刻・天気・ゲームモード） |
| `auto-player-query.flyde` | 自動サブノード | TC-071〜083（プレイヤークエリ） |
| `auto-info.flyde` | 自動サブノード | TC-091〜092（情報取得） |
| `auto-selector.flyde` | 自動サブノード | TC-101〜102（セレクター・ロケール変換） |
| `auto-math.flyde` | 自動サブノード | TC-111〜127（座標・ベクトル演算） |
| `auto-scoreboard.flyde` | 自動サブノード | TC-SB02〜SB05, TC-151〜153（スコアボード） |
| `manual-player-events.flyde` | 手動スタンドアローン | TC-012〜019（プレイヤーイベント） |
| `manual-block-events.flyde` | 手動スタンドアローン | TC-093（ブロックイベント） |
| `manual-item-events.flyde` | 手動スタンドアローン | TC-032, TC-094〜095（アイテムイベント） |
| `manual-mob-events.flyde` | 手動スタンドアローン | TC-042, TC-096（モブイベント） |
| `manual-player-misc.flyde` | 手動スタンドアローン | TC-078（プレイヤーその他） |
| `manual-agents.flyde` | 手動スタンドアローン | TC-131〜146（エージェント） |

---

## テスト実行手順

### 事前準備

`npm install` のみで実行可能（テストフローは `_nodes/index.flyde.ts` を直接参照するため、ビルドは不要）。

### 全自動テスト

1. VSCode で `tests/run-auto-all.flyde` を開く
2. Flyde エディタでフローを実行
3. Minecraft で `/connect localhost:8080`
4. チャットに任意のメッセージを送信
   - `OnPlayerChat` がトリガーされ、以下の順で自動実行される  
     `AutoCommand → AutoPlayerQuery → AutoInfo → AutoSelector → AutoMath → AutoScoreboard`
5. 終了後、ログファイルで結果を確認

```
logs/flyde-mc-YYYY-MM-DD_HH-mm-ss_N.log
```

各 Assert は `[PASS] TC-XXX` または `[FAIL] TC-XXX` として記録される。

### 手動テスト

各 `manual-*.flyde` を個別に開いて実行する。  
それぞれのフローに記載された Note ノードの指示に従って Minecraft 内で操作する。

---

## 自動テストケース一覧

### コマンド系 / `auto-command.flyde`

| TC ID | テスト対象ノード | テスト内容 | 期待値 |
|---|---|---|---|
| TC-051 | RunCommand | `time set day` 実行 | 完了 = true |
| TC-052 | GetGameTime | ゲーム内時刻取得 | ≥ 6000 かつ ≤ 6500（昼）|
| TC-053 | IsDaytime | 昼間判定 | true |
| TC-054 | GetWeather | 天気取得（初期） | `""` 以外 |
| TC-056 | GetWeather | `weather rain` 後の天気 | `"Rain"` |
| TC-057 | GetWeather | `weather clear` 後の天気 | `"Clear"` |
| TC-058 | GetGameMode | `gamemode creative` 後のゲームモード | `"Creative"` |
| TC-059 | GetGameMode | `gamemode survival` 後のゲームモード | `"Survival"` |
| TC-060 | GetTopSolidBlock → Vector3Split | 最上段ブロックの Y 座標 | ≥ -64 |
| TC-064 | FillBlocks | ブロック塗りつぶし個数 | ≥ 0 |

### プレイヤークエリ系 / `auto-player-query.flyde`

| TC ID | テスト対象ノード | テスト内容 | 期待値 |
|---|---|---|---|
| TC-071 | GetLocalPlayer → GetFromPlayerSnapshot | プレイヤー名取得 | `""` 以外 |
| TC-072 | GetPlayerLocation → Vector3Split | プレイヤーの Y 座標 | ≥ -64 |
| TC-073 | GetPlayerOrientation | 向き（角度） | ≥ -180 |
| TC-078 | PlayerHasTag(`__flyde_test_tag__`) | 存在しないタグの判定 | false |
| TC-079 | GetPlayerLevel | 経験値レベル | ≥ 0 |
| TC-083 | GetPlayers | プレイヤー一覧取得 | null 以外 |

### 情報取得系 / `auto-info.flyde`

| TC ID | テスト対象ノード | テスト内容 | 期待値 |
|---|---|---|---|
| TC-091 | GetLocalPlayer → GetFromPlayerSnapshot | プレイヤー名 | `""` 以外 |
| TC-092 | GetFromEntity | エンティティ ID | ≥ 0 ※Minecraft Education では負値（-4294967295）が返る場合あり |

### セレクター系 / `auto-selector.flyde`

| TC ID | テスト対象ノード | テスト内容 | 期待値 |
|---|---|---|---|
| TC-101 | Selector(block, minecraft:grass_block) | ブロック ID 選択 | `"minecraft:grass_block"` |
| TC-102 | ToJa(minecraft:grass_block, block) | ブロック日本語名変換 | `"草ブロック"` |

### 座標・ベクトル演算系 / `auto-math.flyde`

| TC ID | テスト対象ノード | テスト内容 | 期待値 |
|---|---|---|---|
| TC-111 | Vector3Op(add) | (1,2,3) + (4,5,6) | `{x:5, y:7, z:9}` |
| TC-112 | Vector3Op(subtract) | (5,7,9) - (1,2,3) | `{x:4, y:5, z:6}` |
| TC-113 | Vector3Op(scale) | (1,2,3) × 6 | `{x:6, y:12, z:18}` |
| TC-114 | Vector3Op(assemble) | x=10, y=20, z=30 で組み立て | `{x:10, y:20, z:30}` |
| TC-115 | Vector3Op(floor) | (1.7, 2.9, 3.1) の切り捨て | `{x:1, y:2, z:3}` |
| TC-116 | Vector3Op(fill_y) | Y を 64 に設定 | `{x:5, y:64, z:10}` |
| TC-117 | Vector3Distance | (0,0,0) と (3,4,0) の距離 | 5 |
| TC-118 | Vector3ToString | (1, 64, -3) → 文字列 | `"1 64 -3"` |
| TC-119-x | Vector3Split | x 成分 | 10 |
| TC-119-y | Vector3Split | y 成分 | 20 |
| TC-119-z | Vector3Split | z 成分 | 30 |
| TC-120a | ClampNumber | 150 を [0,100] にクランプ | 100 |
| TC-120b | ClampNumber | -10 を [0,100] にクランプ | 0 |
| TC-120c | ClampNumber | 50 を [0,100] にクランプ | 50 |
| TC-121 | AABBCreate | (0,0,0)〜(5,5,5) の AABB 作成 | `{min:{x:0,y:0,z:0}, max:{x:5,y:5,z:5}}` |
| TC-122a | AABBIsInside | (2,2,2) がエリア内 | true |
| TC-122b | AABBIsInside | (10,10,10) がエリア外 | false |
| TC-123 | AABBTranslate | AABB を (5,0,0) 移動 | `{min:{x:5,y:0,z:0}, max:{x:10,y:5,z:5}}` |
| TC-124a | AABBIntersects | 重なるエリア | true |
| TC-124b | AABBIntersects | 重ならないエリア | false |
| TC-125 | Vector3Lerp | (0,0,0) → (10,0,0) の t=0.5 補間 | `{x:5, y:0, z:0}` |
| TC-126 | Vector3Normalize | (5,0,0) の正規化 | `{x:1, y:0, z:0}` |
| TC-127a | Vector3Dot | 直交ベクトルの内積 | 0 |
| TC-127b | Vector3Dot | 平行ベクトルの内積 | 1 |

### スコアボード系 / `auto-scoreboard.flyde`

| TC ID | テスト対象ノード | テスト内容 | 期待値 |
|---|---|---|---|
| TC-SB02 | ScoreOperation(set, 42) | スコアを 42 に設定 | 新スコア = 42 |
| TC-SB03 | GetScore | スコア取得 | 42 |
| TC-SB04 | ScoreOperation(add, 8) | スコアに 8 加算 | 新スコア = 50 |
| TC-SB05 | RemoveScoreboardObjective | 目標削除 | true |
| TC-151 | AddScoreboardObjective → GetFromScoreboardObjective | 目標 ID 確認 | `"mcflowtest2"` |
| TC-153 | GetScoreboardObjective → GetFromScoreboardObjective | 目標 ID 確認 | `"mcflowtest2"` |

---

## 手動テストケース一覧

### プレイヤーイベント / `manual-player-events.flyde`

**事前操作**: フロー実行後、Minecraft で各種操作を実施する

| TC ID | テスト対象ノード | テスト内容 | 手動操作 |
|---|---|---|---|
| TC-012 | OnPlayerTravelled | 移動イベント | プレイヤーが歩く |
| TC-013 | OnPlayerTeleported | テレポートイベント | `/tp` コマンドなどでテレポート |
| TC-014 | OnPlayerBounced | バウンドイベント | スライムブロックなどでバウンド |
| TC-017 | OnPlayerTitle | タイトル表示イベント | `/title` コマンド送信 |
| TC-018 | OnPlayerMessage | メッセージイベント | チャット送信 |
| TC-019 | OnPlayerTransform | 座標変換イベント | 移動・テレポートなど |

### ブロックイベント / `manual-block-events.flyde`

| TC ID | テスト対象ノード | テスト内容 | 手動操作 |
|---|---|---|---|
| TC-093 | OnBlockBroken → GetFromBlockType | ブロック破壊イベント・ブロック種別取得 | ブロックを破壊する |

※ `OnBlockPlaced` は Assert なし（JSON 表示のみ確認）

### アイテムイベント / `manual-item-events.flyde`

| TC ID | テスト対象ノード | テスト内容 | 手動操作 |
|---|---|---|---|
| TC-032 | OnItemAcquired | アイテム取得イベント | アイテムを拾う |
| TC-094 | OnItemAcquired → GetFromItemType | アイテム種別取得 | アイテムを拾う |
| TC-095 | OnItemCrafted → GetFromItemStack | クラフトアイテムのスタック情報 | アイテムをクラフトする |

※ `OnItemEquipped` / `OnItemSmelted` / `OnItemTraded` は Assert なし（JSON 表示のみ確認）

### モブイベント / `manual-mob-events.flyde`

| TC ID | テスト対象ノード | テスト内容 | 手動操作 |
|---|---|---|---|
| TC-042 | OnTargetBlockHit | ターゲットブロック被弾イベント | ターゲットブロックに矢を当てる |
| TC-096 | OnMobInteracted → GetFromMob | モブ操作・モブ情報取得 | モブに対してインタラクト |

### プレイヤーその他 / `manual-player-misc.flyde`

| TC ID | テスト対象ノード | テスト内容 | 手動操作 |
|---|---|---|---|
| TC-078 | PlayerHasTag | タグ付与後の確認 | チャット送信 → フローがタグ操作を行う |

### エージェント / `manual-agents.flyde`

**前提**: Minecraft Education でエージェントが利用可能な環境

| TC ID | テスト対象ノード | テスト内容 |
|---|---|---|
| TC-131 | AgentTeleport | エージェントテレポート完了 |
| TC-132 | GetAgentLocation | エージェント位置取得（x） |
| TC-133 | GetAgentLocation | エージェント位置取得（y） |
| TC-134 | AgentMove | エージェント移動完了 |
| TC-135 | AgentTurn | エージェント旋回完了 |
| TC-138 | AgentAction | エージェントアクション完了 |
| TC-142 | AgentDetect | エージェント検出 |
| TC-143 | AgentDetect | エージェント検出（別軸） |
| TC-144 | AgentDetect | エージェント検出（別軸） |
| TC-145 | AgentSetItem | アイテムセット完了 |
| TC-146 | AgentSetItem | アイテムセット（別スロット） |

---

## テスト結果記録

### 自動テスト結果

| 実行日時 | ログファイル | PASS | FAIL | 備考 |
|---|---|---|---|---|
| | | | | |

### 手動テスト結果

| TC ID | 実行日 | 結果 | 備考 |
|---|---|---|---|
| TC-012 | | | |
| TC-013 | | | |
| TC-014 | | | |
| TC-017 | | | |
| TC-018 | | | |
| TC-019 | | | |
| TC-032 | | | |
| TC-042 | | | |
| TC-078 | | | |
| TC-093 | | | |
| TC-094 | | | |
| TC-095 | | | |
| TC-096 | | | |
| TC-131 | | | |
| TC-132 | | | |
| TC-133 | | | |
| TC-134 | | | |
| TC-135 | | | |
| TC-138 | | | |
| TC-142 | | | |
| TC-143 | | | |
| TC-144 | | | |
| TC-145 | | | |
| TC-146 | | | |
