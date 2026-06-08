import { localizeNode } from './_factory'
import i18n from './_i18n/en_US.json'
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

const e = i18n as Record<string, any>

export const MinecraftConnect    = localizeNode(conn.MinecraftConnect,    e.MinecraftConnect)
export const MinecraftDisconnect = localizeNode(conn.MinecraftDisconnect, e.MinecraftDisconnect)

export const OnPlayerChat      = localizeNode(evPlayer.OnPlayerChat,       e.OnPlayerChat)
export const OnPlayerTravelled = localizeNode(evPlayer.OnPlayerTravelled,  e.OnPlayerTravelled)
export const OnPlayerTeleported= localizeNode(evPlayer.OnPlayerTeleported, e.OnPlayerTeleported)
export const OnPlayerBounced   = localizeNode(evPlayer.OnPlayerBounced,    e.OnPlayerBounced)

export const OnBlockBroken = localizeNode(evBlock.OnBlockBroken, e.OnBlockBroken)
export const OnBlockPlaced = localizeNode(evBlock.OnBlockPlaced, e.OnBlockPlaced)

export const OnItemInteracted = localizeNode(evItem.OnItemInteracted, e.OnItemInteracted)
export const OnItemAcquired   = localizeNode(evItem.OnItemAcquired,   e.OnItemAcquired)
export const OnItemCrafted    = localizeNode(evItem.OnItemCrafted,    e.OnItemCrafted)
export const OnItemEquipped   = localizeNode(evItem.OnItemEquipped,   e.OnItemEquipped)
export const OnItemSmelted    = localizeNode(evItem.OnItemSmelted,    e.OnItemSmelted)
export const OnItemTraded     = localizeNode(evItem.OnItemTraded,     e.OnItemTraded)

export const OnMobInteracted  = localizeNode(evMob.OnMobInteracted,  e.OnMobInteracted)
export const OnTargetBlockHit = localizeNode(evMob.OnTargetBlockHit, e.OnTargetBlockHit)

export const RunCommand  = localizeNode(cmdGameplay.RunCommand,  e.RunCommand)
export const GetGameTime = localizeNode(cmdGameplay.GetGameTime, e.GetGameTime)
export const IsDaytime   = localizeNode(cmdGameplay.IsDaytime,   e.IsDaytime)
export const GetWeather  = localizeNode(cmdGameplay.GetWeather,  e.GetWeather)
export const FillBlocks  = localizeNode(cmdGameplay.FillBlocks,  e.FillBlocks)

export const GetPlayerLocation    = localizeNode(cmdPlayer.GetPlayerLocation,    e.GetPlayerLocation)
export const GetPlayerOrientation = localizeNode(cmdPlayer.GetPlayerOrientation, e.GetPlayerOrientation)

export const GetFromEntity         = localizeNode(info.GetFromEntity,         e.GetFromEntity)
export const GetFromPlayerSnapshot = localizeNode(info.GetFromPlayerSnapshot, e.GetFromPlayerSnapshot)
export const GetFromItemType       = localizeNode(info.GetFromItemType,       e.GetFromItemType)
export const GetFromItemStack      = localizeNode(info.GetFromItemStack,       e.GetFromItemStack)
export const GetFromBlockType      = localizeNode(info.GetFromBlockType,      e.GetFromBlockType)
export const GetFromMob            = localizeNode(info.GetFromMob,            e.GetFromMob)
export const GetFromVillager       = localizeNode(info.GetFromVillager,       e.GetFromVillager)

export const Selector   = localizeNode(selectors.Selector,    e.Selector)
export const LocaleName = localizeNode(converters.LocaleName, e.ToJa)

export const Vector3Op       = localizeNode(math.Vector3Op,       e.Vector3Op)
export const Vector3ToString = localizeNode(math.Vector3ToString, e.Vector3ToString)
export const Vector3Split    = localizeNode(math.Vector3Split,    e.Vector3Split)
