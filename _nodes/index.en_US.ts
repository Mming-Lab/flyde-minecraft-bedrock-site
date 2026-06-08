import { localizeNode } from './_factory'
import i18n from './_i18n/en_US.json'
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

const e = i18n as Record<string, any>

// Connection
export const MinecraftConnect    = localizeNode(conn.MinecraftConnect,    e.MinecraftConnect)
export const MinecraftDisconnect = localizeNode(conn.MinecraftDisconnect, e.MinecraftDisconnect)

// Player events
export const OnPlayerChat       = localizeNode(evPlayer.OnPlayerChat,        e.OnPlayerChat)
export const OnPlayerTravelled  = localizeNode(evPlayer.OnPlayerTravelled,   e.OnPlayerTravelled)
export const OnPlayerTeleported = localizeNode(evPlayer.OnPlayerTeleported,  e.OnPlayerTeleported)
export const OnPlayerBounced    = localizeNode(evPlayer.OnPlayerBounced,     e.OnPlayerBounced)
export const OnPlayerJoin       = localizeNode(evPlayer.OnPlayerJoin,        e.OnPlayerJoin)
export const OnPlayerLeave      = localizeNode(evPlayer.OnPlayerLeave,       e.OnPlayerLeave)
export const OnPlayerTitle      = localizeNode(evPlayer.OnPlayerTitle,       e.OnPlayerTitle)
export const OnPlayerMessage    = localizeNode(evPlayer.OnPlayerMessage,     e.OnPlayerMessage)
export const OnPlayerTransform  = localizeNode(evPlayer.OnPlayerTransform,   e.OnPlayerTransform)

// Block events
export const OnBlockBroken = localizeNode(evBlock.OnBlockBroken, e.OnBlockBroken)
export const OnBlockPlaced = localizeNode(evBlock.OnBlockPlaced, e.OnBlockPlaced)

// Item events
export const OnItemInteracted = localizeNode(evItem.OnItemInteracted, e.OnItemInteracted)
export const OnItemAcquired   = localizeNode(evItem.OnItemAcquired,   e.OnItemAcquired)
export const OnItemCrafted    = localizeNode(evItem.OnItemCrafted,    e.OnItemCrafted)
export const OnItemEquipped   = localizeNode(evItem.OnItemEquipped,   e.OnItemEquipped)
export const OnItemSmelted    = localizeNode(evItem.OnItemSmelted,    e.OnItemSmelted)
export const OnItemTraded     = localizeNode(evItem.OnItemTraded,     e.OnItemTraded)

// Mob events
export const OnMobInteracted  = localizeNode(evMob.OnMobInteracted,  e.OnMobInteracted)
export const OnTargetBlockHit = localizeNode(evMob.OnTargetBlockHit, e.OnTargetBlockHit)

// Gameplay commands
export const RunCommand       = localizeNode(cmdGameplay.RunCommand,        e.RunCommand)
export const GetGameTime      = localizeNode(cmdGameplay.GetGameTime,       e.GetGameTime)
export const IsDaytime        = localizeNode(cmdGameplay.IsDaytime,         e.IsDaytime)
export const GetWeather       = localizeNode(cmdGameplay.GetWeather,        e.GetWeather)
export const FillBlocks       = localizeNode(cmdGameplay.FillBlocks,        e.FillBlocks)
export const SendMessage      = localizeNode(cmdGameplay.SendMessage,       e.SendMessage)
export const SetTimeOfDay     = localizeNode(cmdGameplay.SetTimeOfDay,      e.SetTimeOfDay)
export const SetWeather       = localizeNode(cmdGameplay.SetWeather,        e.SetWeather)
export const SetBlock         = localizeNode(cmdGameplay.SetBlock,          e.SetBlock)
export const GetTopSolidBlock = localizeNode(cmdGameplay.GetTopSolidBlock,  e.GetTopSolidBlock)
export const WorldQuery       = localizeNode(cmdGameplay.WorldQuery,        e.WorldQuery)
export const BroadcastCommand = localizeNode(cmdGameplay.BroadcastCommand,  e.BroadcastCommand)
export const BroadcastMessage = localizeNode(cmdGameplay.BroadcastMessage,  e.BroadcastMessage)

// Player commands
export const GetPlayerLocation    = localizeNode(cmdPlayer.GetPlayerLocation,    e.GetPlayerLocation)
export const GetPlayerOrientation = localizeNode(cmdPlayer.GetPlayerOrientation, e.GetPlayerOrientation)
export const GiveItem             = localizeNode(cmdPlayer.GiveItem,             e.GiveItem)
export const GetPlayerTags        = localizeNode(cmdPlayer.GetPlayerTags,        e.GetPlayerTags)
export const PlayerHasTag         = localizeNode(cmdPlayer.PlayerHasTag,         e.PlayerHasTag)
export const GetPlayerLevel       = localizeNode(cmdPlayer.GetPlayerLevel,       e.GetPlayerLevel)
export const GetGameMode          = localizeNode(cmdPlayer.GetGameMode,          e.GetGameMode)
export const GetPlayerAbilities   = localizeNode(cmdPlayer.GetPlayerAbilities,   e.GetPlayerAbilities)
export const GetPlayers           = localizeNode(cmdPlayer.GetPlayers,           e.GetPlayers)
export const GetLocalPlayer       = localizeNode(cmdPlayer.GetLocalPlayer,       e.GetLocalPlayer)
export const AddPlayerLevel       = localizeNode(cmdPlayer.AddPlayerLevel,       e.AddPlayerLevel)
export const SetGameMode          = localizeNode(cmdPlayer.SetGameMode,          e.SetGameMode)
export const UpdateAbility        = localizeNode(cmdPlayer.UpdateAbility,        e.UpdateAbility)
export const SetTitle             = localizeNode(cmdPlayer.SetTitle,             e.SetTitle)
export const SetActionBar         = localizeNode(cmdPlayer.SetActionBar,         e.SetActionBar)
export const ClearTitle           = localizeNode(cmdPlayer.ClearTitle,           e.ClearTitle)

// Info
export const GetFromEntity                = localizeNode(info.GetFromEntity,                e.GetFromEntity)
export const GetFromPlayerSnapshot        = localizeNode(info.GetFromPlayerSnapshot,        e.GetFromPlayerSnapshot)
export const GetFromItemType              = localizeNode(info.GetFromItemType,              e.GetFromItemType)
export const GetFromItemStack             = localizeNode(info.GetFromItemStack,             e.GetFromItemStack)
export const GetFromBlockType             = localizeNode(info.GetFromBlockType,             e.GetFromBlockType)
export const GetFromScoreboardObjective   = localizeNode(info.GetFromScoreboardObjective,   e.GetFromScoreboardObjective)
export const GetFromMob                   = localizeNode(info.GetFromMob,                   e.GetFromMob)
export const GetFromVillager              = localizeNode(info.GetFromVillager,               e.GetFromVillager)

// Selectors / Converters
export const Selector   = localizeNode(selectors.Selector,    e.Selector)
export const LocaleName = localizeNode(converters.LocaleName, e.ToJa)

// Math
export const Vector3Op       = localizeNode(math.Vector3Op,       e.Vector3Op)
export const Vector3ToString = localizeNode(math.Vector3ToString, e.Vector3ToString)
export const Vector3Split    = localizeNode(math.Vector3Split,    e.Vector3Split)
export const Vector3Distance = localizeNode(math.Vector3Distance, e.Vector3Distance)
export const ClampNumber     = localizeNode(math.ClampNumber,     e.ClampNumber)
export const AABBCreate      = localizeNode(math.AABBCreate,      e.AABBCreate)
export const AABBIsInside    = localizeNode(math.AABBIsInside,    e.AABBIsInside)
export const Vector3Lerp     = localizeNode(math.Vector3Lerp,     e.Vector3Lerp)
export const Vector3Normalize = localizeNode(math.Vector3Normalize, e.Vector3Normalize)
export const Vector3Dot      = localizeNode(math.Vector3Dot,      e.Vector3Dot)
export const AABBTranslate   = localizeNode(math.AABBTranslate,   e.AABBTranslate)
export const AABBIntersects  = localizeNode(math.AABBIntersects,  e.AABBIntersects)

// Agents
export const GetAgentLocation = localizeNode(agents.GetAgentLocation, e.GetAgentLocation)
export const AgentMove        = localizeNode(agents.AgentMove,         e.AgentMove)
export const AgentTurn        = localizeNode(agents.AgentTurn,         e.AgentTurn)
export const AgentTeleport    = localizeNode(agents.AgentTeleport,     e.AgentTeleport)
export const AgentAction      = localizeNode(agents.AgentAction,       e.AgentAction)
export const AgentPlaceBlock  = localizeNode(agents.AgentPlaceBlock,   e.AgentPlaceBlock)
export const AgentDropItem    = localizeNode(agents.AgentDropItem,     e.AgentDropItem)
export const AgentMoveItem    = localizeNode(agents.AgentMoveItem,     e.AgentMoveItem)
export const AgentSetItem     = localizeNode(agents.AgentSetItem,      e.AgentSetItem)
export const AgentCollect     = localizeNode(agents.AgentCollect,      e.AgentCollect)

// Scoreboard
export const GetScoreboardObjectives   = localizeNode(scoreboard.GetScoreboardObjectives,   e.GetScoreboardObjectives)
export const GetScoreboardObjective    = localizeNode(scoreboard.GetScoreboardObjective,    e.GetScoreboardObjective)
export const AddScoreboardObjective    = localizeNode(scoreboard.AddScoreboardObjective,    e.AddScoreboardObjective)
export const RemoveScoreboardObjective = localizeNode(scoreboard.RemoveScoreboardObjective, e.RemoveScoreboardObjective)
export const GetScores                 = localizeNode(scoreboard.GetScores,                 e.GetScores)
export const GetScore                  = localizeNode(scoreboard.GetScore,                  e.GetScore)
export const ScoreOperation            = localizeNode(scoreboard.ScoreOperation,            e.ScoreOperation)
