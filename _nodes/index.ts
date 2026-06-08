import { localizeNode } from './_factory'
import i18n from './_i18n/ja_JP.json'
import * as conn from './_core/connection'
import * as evPlayer from './_core/events/player'
import * as evBlock from './_core/events/block'
import * as evItem from './_core/events/item'
import * as evMob from './_core/events/mob'
import * as cmdGameplay from './_core/commands/gameplay'
import * as cmdPlayer from './_core/commands/player'
import * as info from './_core/utils/info'
import * as selectors from './_core/utils/selectors'
import * as converters from './_core/utils/converters'
import * as math from './_core/utils/math'

const j = i18n as Record<string, any>

// 接続系
export const Minecraft接続    = localizeNode(conn.MinecraftConnect,    j.MinecraftConnect)
export const Minecraft切断    = localizeNode(conn.MinecraftDisconnect,  j.MinecraftDisconnect)

// プレイヤーイベント系
export const チャット受信       = localizeNode(evPlayer.OnPlayerChat,       j.OnPlayerChat)
export const プレイヤーが移動   = localizeNode(evPlayer.OnPlayerTravelled,  j.OnPlayerTravelled)
export const テレポート完了     = localizeNode(evPlayer.OnPlayerTeleported, j.OnPlayerTeleported)
export const バウンス           = localizeNode(evPlayer.OnPlayerBounced,    j.OnPlayerBounced)

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
export const コマンド実行       = localizeNode(cmdGameplay.RunCommand,  j.RunCommand)
export const ゲーム内時刻取得   = localizeNode(cmdGameplay.GetGameTime, j.GetGameTime)
export const 昼夜判定           = localizeNode(cmdGameplay.IsDaytime,   j.IsDaytime)
export const 天気を取得         = localizeNode(cmdGameplay.GetWeather,  j.GetWeather)
export const エリアを塗りつぶす  = localizeNode(cmdGameplay.FillBlocks, j.FillBlocks)

// プレイヤー操作系（基本）
export const プレイヤー座標取得 = localizeNode(cmdPlayer.GetPlayerLocation,    j.GetPlayerLocation)
export const プレイヤー向き取得 = localizeNode(cmdPlayer.GetPlayerOrientation, j.GetPlayerOrientation)

// 情報取得系
export const エンティティ情報取得 = localizeNode(info.GetFromEntity,          j.GetFromEntity)
export const プレイヤー情報取得   = localizeNode(info.GetFromPlayerSnapshot,   j.GetFromPlayerSnapshot)
export const アイテム種別情報取得 = localizeNode(info.GetFromItemType,         j.GetFromItemType)
export const 所持アイテム情報取得 = localizeNode(info.GetFromItemStack,        j.GetFromItemStack)
export const ブロック情報取得     = localizeNode(info.GetFromBlockType,        j.GetFromBlockType)
export const モブ情報取得         = localizeNode(info.GetFromMob,              j.GetFromMob)
export const 村人情報取得         = localizeNode(info.GetFromVillager,         j.GetFromVillager)

// 選択・変換系
export const 選択       = localizeNode(selectors.Selector,    j.Selector)
export const 日本語変換 = localizeNode(converters.LocaleName, j.ToJa)

// 座標演算系
export const 座標演算          = localizeNode(math.Vector3Op,       j.Vector3Op)
export const 座標を文字列に変換 = localizeNode(math.Vector3ToString, j.Vector3ToString)
export const 座標を分解        = localizeNode(math.Vector3Split,     j.Vector3Split)
