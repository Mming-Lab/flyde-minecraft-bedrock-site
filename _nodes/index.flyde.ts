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

const n = i18n as Record<string, any>

// Connection
export const MinecraftConnect    = localizeNode(conn.MinecraftConnect,    n.MinecraftConnect)
export const MinecraftDisconnect = localizeNode(conn.MinecraftDisconnect, n.MinecraftDisconnect)

// Player events
export const OnPlayerChat       = localizeNode(evPlayer.OnPlayerChat,       n.OnPlayerChat)
export const OnPlayerTravelled  = localizeNode(evPlayer.OnPlayerTravelled,  n.OnPlayerTravelled)
export const OnPlayerTeleported = localizeNode(evPlayer.OnPlayerTeleported, n.OnPlayerTeleported)
export const OnPlayerBounced    = localizeNode(evPlayer.OnPlayerBounced,    n.OnPlayerBounced)
export const OnPlayerJoin       = localizeNode(evPlayer.OnPlayerJoin,       n.OnPlayerJoin)
export const OnPlayerLeave      = localizeNode(evPlayer.OnPlayerLeave,      n.OnPlayerLeave)
export const OnPlayerTitle      = localizeNode(evPlayer.OnPlayerTitle,      n.OnPlayerTitle)
export const OnPlayerMessage    = localizeNode(evPlayer.OnPlayerMessage,    n.OnPlayerMessage)
export const OnPlayerTransform  = localizeNode(evPlayer.OnPlayerTransform,  n.OnPlayerTransform)

// Block events
export const OnBlockBroken = localizeNode(evBlock.OnBlockBroken, n.OnBlockBroken)
export const OnBlockPlaced = localizeNode(evBlock.OnBlockPlaced, n.OnBlockPlaced)

// Item events
export const OnItemInteracted = localizeNode(evItem.OnItemInteracted, n.OnItemInteracted)
export const OnItemAcquired   = localizeNode(evItem.OnItemAcquired,   n.OnItemAcquired)
export const OnItemCrafted    = localizeNode(evItem.OnItemCrafted,    n.OnItemCrafted)
export const OnItemEquipped   = localizeNode(evItem.OnItemEquipped,   n.OnItemEquipped)
export const OnItemSmelted    = localizeNode(evItem.OnItemSmelted,    n.OnItemSmelted)
export const OnItemTraded     = localizeNode(evItem.OnItemTraded,     n.OnItemTraded)

// Mob events
export const OnMobInteracted  = localizeNode(evMob.OnMobInteracted,  n.OnMobInteracted)
export const OnTargetBlockHit = localizeNode(evMob.OnTargetBlockHit, n.OnTargetBlockHit)

// Gameplay commands
export const RunCommand       = localizeNode(cmdGameplay.RunCommand,        n.RunCommand)
export const GetGameTime      = localizeNode(cmdGameplay.GetGameTime,       n.GetGameTime)
export const IsDaytime        = localizeNode(cmdGameplay.IsDaytime,         n.IsDaytime)
export const GetWeather       = localizeNode(cmdGameplay.GetWeather,        n.GetWeather)
export const FillBlocks       = localizeNode(cmdGameplay.FillBlocks,        n.FillBlocks)
export const SendMessage      = localizeNode(cmdGameplay.SendMessage,       n.SendMessage)
export const SetTimeOfDay     = localizeNode(cmdGameplay.SetTimeOfDay,      n.SetTimeOfDay)
export const SetWeather       = localizeNode(cmdGameplay.SetWeather,        n.SetWeather)
export const SetBlock         = localizeNode(cmdGameplay.SetBlock,          n.SetBlock)
export const GetTopSolidBlock = localizeNode(cmdGameplay.GetTopSolidBlock,  n.GetTopSolidBlock)
export const WorldQuery       = localizeNode(cmdGameplay.WorldQuery,        n.WorldQuery)
export const BroadcastCommand = localizeNode(cmdGameplay.BroadcastCommand,  n.BroadcastCommand)
export const BroadcastMessage = localizeNode(cmdGameplay.BroadcastMessage,  n.BroadcastMessage)

// Player commands
export const GetPlayerLocation    = localizeNode(cmdPlayer.GetPlayerLocation,    n.GetPlayerLocation)
export const GetPlayerOrientation = localizeNode(cmdPlayer.GetPlayerOrientation, n.GetPlayerOrientation)
export const GiveItem             = localizeNode(cmdPlayer.GiveItem,             n.GiveItem)
export const GetPlayerTags        = localizeNode(cmdPlayer.GetPlayerTags,        n.GetPlayerTags)
export const PlayerHasTag         = localizeNode(cmdPlayer.PlayerHasTag,         n.PlayerHasTag)
export const GetPlayerLevel       = localizeNode(cmdPlayer.GetPlayerLevel,       n.GetPlayerLevel)
export const GetGameMode          = localizeNode(cmdPlayer.GetGameMode,          n.GetGameMode)
export const GetPlayerAbilities   = localizeNode(cmdPlayer.GetPlayerAbilities,   n.GetPlayerAbilities)
export const GetPlayers           = localizeNode(cmdPlayer.GetPlayers,           n.GetPlayers)
export const GetLocalPlayer       = localizeNode(cmdPlayer.GetLocalPlayer,       n.GetLocalPlayer)
export const AddPlayerLevel       = localizeNode(cmdPlayer.AddPlayerLevel,       n.AddPlayerLevel)
export const SetGameMode          = localizeNode(cmdPlayer.SetGameMode,          n.SetGameMode)
export const UpdateAbility        = localizeNode(cmdPlayer.UpdateAbility,        n.UpdateAbility)
export const SetTitle             = localizeNode(cmdPlayer.SetTitle,             n.SetTitle)
export const SetActionBar         = localizeNode(cmdPlayer.SetActionBar,         n.SetActionBar)
export const ClearTitle           = localizeNode(cmdPlayer.ClearTitle,           n.ClearTitle)

// Info
export const GetFromEntity              = localizeNode(info.GetFromEntity,              n.GetFromEntity)
export const GetFromPlayerSnapshot      = localizeNode(info.GetFromPlayerSnapshot,      n.GetFromPlayerSnapshot)
export const GetFromItemType            = localizeNode(info.GetFromItemType,            n.GetFromItemType)
export const GetFromItemStack           = localizeNode(info.GetFromItemStack,           n.GetFromItemStack)
export const GetFromBlockType           = localizeNode(info.GetFromBlockType,           n.GetFromBlockType)
export const GetFromScoreboardObjective = localizeNode(info.GetFromScoreboardObjective, n.GetFromScoreboardObjective)
export const GetFromMob                 = localizeNode(info.GetFromMob,                 n.GetFromMob)
export const GetFromVillager            = localizeNode(info.GetFromVillager,            n.GetFromVillager)

// Selectors / Converters
export const Selector   = localizeNode(selectors.Selector,    n.Selector)
export const LocaleName = localizeNode(converters.LocaleName, n.ToJa)

// Math
export const Vector3Op        = localizeNode(math.Vector3Op,        n.Vector3Op)
export const Vector3ToString  = localizeNode(math.Vector3ToString,  n.Vector3ToString)
export const Vector3Split     = localizeNode(math.Vector3Split,     n.Vector3Split)
export const Vector3Distance  = localizeNode(math.Vector3Distance,  n.Vector3Distance)
export const ClampNumber      = localizeNode(math.ClampNumber,      n.ClampNumber)
export const AABBCreate       = localizeNode(math.AABBCreate,       n.AABBCreate)
export const AABBIsInside     = localizeNode(math.AABBIsInside,     n.AABBIsInside)
export const Vector3Lerp      = localizeNode(math.Vector3Lerp,      n.Vector3Lerp)
export const Vector3Normalize = localizeNode(math.Vector3Normalize, n.Vector3Normalize)
export const Vector3Dot       = localizeNode(math.Vector3Dot,       n.Vector3Dot)
export const AABBTranslate    = localizeNode(math.AABBTranslate,    n.AABBTranslate)
export const AABBIntersects   = localizeNode(math.AABBIntersects,   n.AABBIntersects)

// Agents
export const GetAgentLocation = localizeNode(agents.GetAgentLocation, n.GetAgentLocation)
export const AgentMove        = localizeNode(agents.AgentMove,        n.AgentMove)
export const AgentTurn        = localizeNode(agents.AgentTurn,        n.AgentTurn)
export const AgentTeleport    = localizeNode(agents.AgentTeleport,    n.AgentTeleport)
export const AgentAction      = localizeNode(agents.AgentAction,      n.AgentAction)
export const AgentPlaceBlock  = localizeNode(agents.AgentPlaceBlock,  n.AgentPlaceBlock)
export const AgentDropItem    = localizeNode(agents.AgentDropItem,    n.AgentDropItem)
export const AgentMoveItem    = localizeNode(agents.AgentMoveItem,    n.AgentMoveItem)
export const AgentSetItem     = localizeNode(agents.AgentSetItem,     n.AgentSetItem)
export const AgentCollect     = localizeNode(agents.AgentCollect,     n.AgentCollect)

// Scoreboard
export const GetScoreboardObjectives   = localizeNode(scoreboard.GetScoreboardObjectives,   n.GetScoreboardObjectives)
export const GetScoreboardObjective    = localizeNode(scoreboard.GetScoreboardObjective,    n.GetScoreboardObjective)
export const AddScoreboardObjective    = localizeNode(scoreboard.AddScoreboardObjective,    n.AddScoreboardObjective)
export const RemoveScoreboardObjective = localizeNode(scoreboard.RemoveScoreboardObjective, n.RemoveScoreboardObjective)
export const GetScores                 = localizeNode(scoreboard.GetScores,                 n.GetScores)
export const GetScore                  = localizeNode(scoreboard.GetScore,                  n.GetScore)
export const ScoreOperation            = localizeNode(scoreboard.ScoreOperation,            n.ScoreOperation)
