import { localizeNode } from './_factory'
import { withDiagLog } from './diag'
import i18n from './_i18n/ja_JP.json'
import * as conn from './_core/connection'
import * as evPlayer from './_core/events/player'
import * as evBlock from './_core/events/block'
import * as evItem from './_core/events/item'
import * as cmdGameplay from './_core/commands/gameplay'
import * as cmdPlayer from './_core/commands/player'
import * as info from './_core/utils/info'
import * as selectors from './_core/utils/selectors'
import * as converters from './_core/utils/converters'
import * as math from './_core/utils/math'

const n = i18n as Record<string, any>
const ln = (node: any, t: any) => withDiagLog(localizeNode(node, t))

// Connection
export const MinecraftConnect    = ln(conn.MinecraftConnect,    n.MinecraftConnect)
export const MinecraftDisconnect = ln(conn.MinecraftDisconnect, n.MinecraftDisconnect)

// Player events
export const OnPlayerChat       = ln(evPlayer.OnPlayerChat,       n.OnPlayerChat)
export const OnPlayerTravelled  = ln(evPlayer.OnPlayerTravelled,  n.OnPlayerTravelled)
export const OnPlayerTeleported = ln(evPlayer.OnPlayerTeleported, n.OnPlayerTeleported)
export const OnPlayerBounced    = ln(evPlayer.OnPlayerBounced,    n.OnPlayerBounced)
export const OnPlayerTransform  = ln(evPlayer.OnPlayerTransform,  n.OnPlayerTransform)

// Block events
export const OnBlockBroken = ln(evBlock.OnBlockBroken, n.OnBlockBroken)
export const OnBlockPlaced = ln(evBlock.OnBlockPlaced, n.OnBlockPlaced)

// Item events
export const OnItemInteracted = ln(evItem.OnItemInteracted, n.OnItemInteracted)
export const OnItemAcquired   = ln(evItem.OnItemAcquired,   n.OnItemAcquired)
export const OnItemCrafted    = ln(evItem.OnItemCrafted,    n.OnItemCrafted)
export const OnItemEquipped   = ln(evItem.OnItemEquipped,   n.OnItemEquipped)
export const OnItemSmelted    = ln(evItem.OnItemSmelted,    n.OnItemSmelted)
export const OnItemTraded     = ln(evItem.OnItemTraded,     n.OnItemTraded)

// Gameplay commands
export const RunCommand       = ln(cmdGameplay.RunCommand,       n.RunCommand)
export const GetGameTime  = ln(cmdGameplay.GetGameTime,  n.GetGameTime)
export const IsDaytime    = ln(cmdGameplay.IsDaytime,    n.IsDaytime)
export const GetWeather   = ln(cmdGameplay.GetWeather,   n.GetWeather)
export const FillBlocks   = ln(cmdGameplay.FillBlocks,   n.FillBlocks)

// Player commands
export const GetPlayerLocation    = ln(cmdPlayer.GetPlayerLocation,    n.GetPlayerLocation)
export const GetPlayerOrientation = ln(cmdPlayer.GetPlayerOrientation, n.GetPlayerOrientation)
export const GetGameMode    = ln(cmdPlayer.GetGameMode,    n.GetGameMode)
export const GetLocalPlayer = ln(cmdPlayer.GetLocalPlayer, n.GetLocalPlayer)

// Info
export const GetFromEntity         = ln(info.GetFromEntity,         n.GetFromEntity)
export const GetFromPlayerSnapshot = ln(info.GetFromPlayerSnapshot, n.GetFromPlayerSnapshot)
export const GetFromItemType       = ln(info.GetFromItemType,       n.GetFromItemType)
export const GetFromItemStack      = ln(info.GetFromItemStack,      n.GetFromItemStack)
export const GetFromBlockType      = ln(info.GetFromBlockType,      n.GetFromBlockType)
export const GetFromVillager       = ln(info.GetFromVillager,       n.GetFromVillager)

// Selectors / Converters
export const Selector   = ln(selectors.Selector,    n.Selector)
export const LocaleName = ln(converters.LocaleName, n.ToJa)

// Math
export const Vector3Op       = ln(math.Vector3Op,       n.Vector3Op)
export const Vector3ToString = ln(math.Vector3ToString, n.Vector3ToString)
export const Vector3Split    = ln(math.Vector3Split,    n.Vector3Split)
