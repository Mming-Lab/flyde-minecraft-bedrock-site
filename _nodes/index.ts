import { localizeNode } from './_factory'
import i18n from './_i18n/ja_JP.json'
import * as conn from './_core/connection'
import * as evPlayer from './_core/events/player'
import * as evBlock from './_core/events/block'
import * as evItem from './_core/events/item'
import * as evMob from './_core/events/mob'
import * as cmdGameplay from './_core/commands/gameplay'
import * as cmdPlayer from './_core/commands/player'
import * as agents from './_core/agents'
import * as scoreboard from './_core/scoreboard'
import * as info from './_core/utils/info'
import * as selectors from './_core/utils/selectors'
import * as converters from './_core/utils/converters'
import * as math from './_core/utils/math'

const j = i18n as Record<string, any>

// 接続系
export const Minecraft接続    = localizeNode(conn.MinecraftConnect,    j.MinecraftConnect)
export const Minecraft切断    = localizeNode(conn.MinecraftDisconnect,  j.MinecraftDisconnect)

// プレイヤーイベント系
export const チャット受信         = localizeNode(evPlayer.OnPlayerChat,        j.OnPlayerChat)
export const プレイヤーが移動     = localizeNode(evPlayer.OnPlayerTravelled,   j.OnPlayerTravelled)
export const テレポート完了       = localizeNode(evPlayer.OnPlayerTeleported,  j.OnPlayerTeleported)
export const バウンス             = localizeNode(evPlayer.OnPlayerBounced,     j.OnPlayerBounced)
export const プレイヤー参加       = localizeNode(evPlayer.OnPlayerJoin,        j.OnPlayerJoin)
export const プレイヤー退出       = localizeNode(evPlayer.OnPlayerLeave,       j.OnPlayerLeave)
export const タイトル受信         = localizeNode(evPlayer.OnPlayerTitle,       j.OnPlayerTitle)
export const メッセージ受信       = localizeNode(evPlayer.OnPlayerMessage,     j.OnPlayerMessage)
export const プレイヤー位置変化   = localizeNode(evPlayer.OnPlayerTransform,   j.OnPlayerTransform)

// ブロックイベント系
export const ブロック破壊         = localizeNode(evBlock.OnBlockBroken, j.OnBlockBroken)
export const ブロック設置イベント  = localizeNode(evBlock.OnBlockPlaced, j.OnBlockPlaced)

// アイテムイベント系
export const アイテムを使った   = localizeNode(evItem.OnItemInteracted, j.OnItemInteracted)
export const アイテム取得       = localizeNode(evItem.OnItemAcquired,   j.OnItemAcquired)
export const アイテムをクラフト  = localizeNode(evItem.OnItemCrafted,   j.OnItemCrafted)
export const アイテムを装備     = localizeNode(evItem.OnItemEquipped,   j.OnItemEquipped)
export const アイテムを精錬     = localizeNode(evItem.OnItemSmelted,    j.OnItemSmelted)
export const アイテムを取引     = localizeNode(evItem.OnItemTraded,     j.OnItemTraded)

// モブイベント系
export const モブと交流     = localizeNode(evMob.OnMobInteracted,  j.OnMobInteracted)
export const 的ブロック命中 = localizeNode(evMob.OnTargetBlockHit, j.OnTargetBlockHit)

// ゲームプレイ系
export const コマンド実行       = localizeNode(cmdGameplay.RunCommand,        j.RunCommand)
export const ゲーム内時刻取得   = localizeNode(cmdGameplay.GetGameTime,       j.GetGameTime)
export const 昼夜判定           = localizeNode(cmdGameplay.IsDaytime,         j.IsDaytime)
export const 天気を取得         = localizeNode(cmdGameplay.GetWeather,        j.GetWeather)
export const エリアを塗りつぶす  = localizeNode(cmdGameplay.FillBlocks,       j.FillBlocks)
export const メッセージ送信     = localizeNode(cmdGameplay.SendMessage,       j.SendMessage)
export const 時刻設定           = localizeNode(cmdGameplay.SetTimeOfDay,      j.SetTimeOfDay)
export const 天気設定           = localizeNode(cmdGameplay.SetWeather,        j.SetWeather)
export const ブロック設置       = localizeNode(cmdGameplay.SetBlock,          j.SetBlock)
export const 最上部ブロック取得  = localizeNode(cmdGameplay.GetTopSolidBlock, j.GetTopSolidBlock)
export const ワールドクエリ      = localizeNode(cmdGameplay.WorldQuery,       j.WorldQuery)
export const 全体コマンド実行    = localizeNode(cmdGameplay.BroadcastCommand, j.BroadcastCommand)
export const 全体メッセージ送信  = localizeNode(cmdGameplay.BroadcastMessage, j.BroadcastMessage)

// プレイヤー操作系
export const プレイヤー座標取得  = localizeNode(cmdPlayer.GetPlayerLocation,    j.GetPlayerLocation)
export const プレイヤー向き取得  = localizeNode(cmdPlayer.GetPlayerOrientation, j.GetPlayerOrientation)
export const アイテム付与        = localizeNode(cmdPlayer.GiveItem,             j.GiveItem)
export const タグ一覧取得        = localizeNode(cmdPlayer.GetPlayerTags,        j.GetPlayerTags)
export const タグ確認            = localizeNode(cmdPlayer.PlayerHasTag,         j.PlayerHasTag)
export const レベル取得          = localizeNode(cmdPlayer.GetPlayerLevel,       j.GetPlayerLevel)
export const GMD取得             = localizeNode(cmdPlayer.GetGameMode,          j.GetGameMode)
export const アビリティ取得      = localizeNode(cmdPlayer.GetPlayerAbilities,   j.GetPlayerAbilities)
export const プレイヤー一覧      = localizeNode(cmdPlayer.GetPlayers,           j.GetPlayers)
export const ローカルPLY取得     = localizeNode(cmdPlayer.GetLocalPlayer,       j.GetLocalPlayer)
export const レベル加算          = localizeNode(cmdPlayer.AddPlayerLevel,       j.AddPlayerLevel)
export const GMD設定             = localizeNode(cmdPlayer.SetGameMode,          j.SetGameMode)
export const アビリティ変更      = localizeNode(cmdPlayer.UpdateAbility,        j.UpdateAbility)
export const タイトル表示        = localizeNode(cmdPlayer.SetTitle,             j.SetTitle)
export const アクションバー      = localizeNode(cmdPlayer.SetActionBar,         j.SetActionBar)
export const タイトル消去        = localizeNode(cmdPlayer.ClearTitle,           j.ClearTitle)

// 情報取得系
export const エンティティ情報取得       = localizeNode(info.GetFromEntity,                j.GetFromEntity)
export const プレイヤー情報取得         = localizeNode(info.GetFromPlayerSnapshot,         j.GetFromPlayerSnapshot)
export const アイテム種別情報取得       = localizeNode(info.GetFromItemType,               j.GetFromItemType)
export const 所持アイテム情報取得       = localizeNode(info.GetFromItemStack,              j.GetFromItemStack)
export const ブロック情報取得           = localizeNode(info.GetFromBlockType,              j.GetFromBlockType)
export const スコアボード目標情報取得   = localizeNode(info.GetFromScoreboardObjective,    j.GetFromScoreboardObjective)
export const モブ情報取得               = localizeNode(info.GetFromMob,                    j.GetFromMob)
export const 村人情報取得               = localizeNode(info.GetFromVillager,               j.GetFromVillager)

// 選択・変換系
export const 選択       = localizeNode(selectors.Selector,    j.Selector)
export const 日本語変換 = localizeNode(converters.LocaleName, j.ToJa)

// 座標演算系
export const 座標演算          = localizeNode(math.Vector3Op,       j.Vector3Op)
export const 座標を文字列に変換 = localizeNode(math.Vector3ToString, j.Vector3ToString)
export const 座標を分解        = localizeNode(math.Vector3Split,     j.Vector3Split)

// エージェント系
export const エージェント座標取得    = localizeNode(agents.GetAgentLocation, j.GetAgentLocation)
export const エージェント移動        = localizeNode(agents.AgentMove,         j.AgentMove)
export const エージェント回転        = localizeNode(agents.AgentTurn,         j.AgentTurn)
export const エージェントTP          = localizeNode(agents.AgentTeleport,     j.AgentTeleport)
export const エージェント行動        = localizeNode(agents.AgentAction,       j.AgentAction)
export const エージェントブロック設置 = localizeNode(agents.AgentPlaceBlock,  j.AgentPlaceBlock)
export const エージェントアイテム投棄 = localizeNode(agents.AgentDropItem,    j.AgentDropItem)
export const エージェントスロット移動 = localizeNode(agents.AgentMoveItem,    j.AgentMoveItem)
export const エージェントアイテムセット = localizeNode(agents.AgentSetItem,   j.AgentSetItem)
export const エージェントアイテム収集 = localizeNode(agents.AgentCollect,     j.AgentCollect)

// スコアボード系
export const スコアボード目標一覧取得 = localizeNode(scoreboard.GetScoreboardObjectives,   j.GetScoreboardObjectives)
export const スコアボード目標取得     = localizeNode(scoreboard.GetScoreboardObjective,    j.GetScoreboardObjective)
export const スコアボード目標追加     = localizeNode(scoreboard.AddScoreboardObjective,    j.AddScoreboardObjective)
export const スコアボード目標削除     = localizeNode(scoreboard.RemoveScoreboardObjective, j.RemoveScoreboardObjective)
export const 全スコア取得            = localizeNode(scoreboard.GetScores,                 j.GetScores)
export const スコア取得              = localizeNode(scoreboard.GetScore,                  j.GetScore)
export const スコア演算              = localizeNode(scoreboard.ScoreOperation,            j.ScoreOperation)

// 数学拡張系
export const 座標間の距離   = localizeNode(math.Vector3Distance,  j.Vector3Distance)
export const 数値クランプ   = localizeNode(math.ClampNumber,       j.ClampNumber)
export const エリアを作る   = localizeNode(math.AABBCreate,        j.AABBCreate)
export const エリア内判定   = localizeNode(math.AABBIsInside,      j.AABBIsInside)
export const 座標補間       = localizeNode(math.Vector3Lerp,       j.Vector3Lerp)
export const 正規化ベクトル = localizeNode(math.Vector3Normalize,  j.Vector3Normalize)
export const 内積           = localizeNode(math.Vector3Dot,        j.Vector3Dot)
export const エリア移動     = localizeNode(math.AABBTranslate,     j.AABBTranslate)
export const エリア重複判定 = localizeNode(math.AABBIntersects,    j.AABBIntersects)
