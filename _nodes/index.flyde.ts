import { localizeNode } from './_factory'
import { withDiagLog } from './diag'
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
import * as assertUtil from './_core/utils/assert'

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
export const OnPlayerJoin       = ln(evPlayer.OnPlayerJoin,       n.OnPlayerJoin)
export const OnPlayerLeave      = ln(evPlayer.OnPlayerLeave,      n.OnPlayerLeave)
export const OnPlayerTitle      = ln(evPlayer.OnPlayerTitle,      n.OnPlayerTitle)
export const OnPlayerMessage    = ln(evPlayer.OnPlayerMessage,    n.OnPlayerMessage)
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

// Mob events
export const OnMobInteracted  = ln(evMob.OnMobInteracted,  n.OnMobInteracted)
export const OnTargetBlockHit = ln(evMob.OnTargetBlockHit, n.OnTargetBlockHit)

// Gameplay commands
export const RunCommand       = ln(cmdGameplay.RunCommand,        n.RunCommand)
export const GetGameTime      = ln(cmdGameplay.GetGameTime,       n.GetGameTime)
export const IsDaytime        = ln(cmdGameplay.IsDaytime,         n.IsDaytime)
export const GetWeather       = ln(cmdGameplay.GetWeather,        n.GetWeather)
export const FillBlocks       = ln(cmdGameplay.FillBlocks,        n.FillBlocks)
export const GetTopSolidBlock = ln(cmdGameplay.GetTopSolidBlock,  n.GetTopSolidBlock)
export const WorldQuery       = ln(cmdGameplay.WorldQuery,        n.WorldQuery)

// Player commands
export const GetPlayerLocation    = ln(cmdPlayer.GetPlayerLocation,    n.GetPlayerLocation)
export const GetPlayerOrientation = ln(cmdPlayer.GetPlayerOrientation, n.GetPlayerOrientation)
export const GetPlayerTags        = ln(cmdPlayer.GetPlayerTags,        n.GetPlayerTags)
export const PlayerHasTag         = ln(cmdPlayer.PlayerHasTag,         n.PlayerHasTag)
export const GetPlayerLevel       = ln(cmdPlayer.GetPlayerLevel,       n.GetPlayerLevel)
export const GetGameMode          = ln(cmdPlayer.GetGameMode,          n.GetGameMode)
export const GetPlayerAbilities   = ln(cmdPlayer.GetPlayerAbilities,   n.GetPlayerAbilities)
export const GetPlayers           = ln(cmdPlayer.GetPlayers,           n.GetPlayers)
export const GetLocalPlayer       = ln(cmdPlayer.GetLocalPlayer,       n.GetLocalPlayer)

// Info
export const GetFromEntity              = ln(info.GetFromEntity,              n.GetFromEntity)
export const GetFromPlayerSnapshot      = ln(info.GetFromPlayerSnapshot,      n.GetFromPlayerSnapshot)
export const GetFromItemType            = ln(info.GetFromItemType,            n.GetFromItemType)
export const GetFromItemStack           = ln(info.GetFromItemStack,           n.GetFromItemStack)
export const GetFromBlockType           = ln(info.GetFromBlockType,           n.GetFromBlockType)
export const GetFromScoreboardObjective = ln(info.GetFromScoreboardObjective, n.GetFromScoreboardObjective)
export const GetFromMob                 = ln(info.GetFromMob,                 n.GetFromMob)
export const GetFromVillager            = ln(info.GetFromVillager,            n.GetFromVillager)

// Selectors / Converters
export const Selector   = ln(selectors.Selector,    n.Selector)
export const LocaleName = ln(converters.LocaleName, n.ToJa)

// Math
export const Vector3Op        = ln(math.Vector3Op,        n.Vector3Op)
export const Vector3ToString  = ln(math.Vector3ToString,  n.Vector3ToString)
export const Vector3Split     = ln(math.Vector3Split,     n.Vector3Split)
export const Vector3Distance  = ln(math.Vector3Distance,  n.Vector3Distance)
export const ClampNumber      = ln(math.ClampNumber,      n.ClampNumber)
export const AABBCreate       = ln(math.AABBCreate,       n.AABBCreate)
export const AABBIsInside     = ln(math.AABBIsInside,     n.AABBIsInside)
export const Vector3Lerp      = ln(math.Vector3Lerp,      n.Vector3Lerp)
export const Vector3Normalize = ln(math.Vector3Normalize, n.Vector3Normalize)
export const Vector3Dot       = ln(math.Vector3Dot,       n.Vector3Dot)
export const AABBTranslate    = ln(math.AABBTranslate,    n.AABBTranslate)
export const AABBIntersects   = ln(math.AABBIntersects,   n.AABBIntersects)

// Test utilities
export const Assert = ln(assertUtil.Assert, n.Assert)

// Agents
export const GetAgentLocation = ln(agents.GetAgentLocation, n.GetAgentLocation)
export const AgentMove        = ln(agents.AgentMove,        n.AgentMove)
export const AgentTurn        = ln(agents.AgentTurn,        n.AgentTurn)
export const AgentTeleport    = ln(agents.AgentTeleport,    n.AgentTeleport)
export const AgentAction      = ln(agents.AgentAction,      n.AgentAction)
export const AgentPlaceBlock  = ln(agents.AgentPlaceBlock,  n.AgentPlaceBlock)
export const AgentDropItem    = ln(agents.AgentDropItem,    n.AgentDropItem)
export const AgentMoveItem    = ln(agents.AgentMoveItem,    n.AgentMoveItem)
export const AgentSetItem     = ln(agents.AgentSetItem,     n.AgentSetItem)
export const AgentCollect        = ln(agents.AgentCollect,        n.AgentCollect)
export const AgentDetect         = ln(agents.AgentDetect,         n.AgentDetect)

// Scoreboard
export const GetScoreboardObjectives   = ln(scoreboard.GetScoreboardObjectives,   n.GetScoreboardObjectives)
export const GetScoreboardObjective    = ln(scoreboard.GetScoreboardObjective,    n.GetScoreboardObjective)
export const AddScoreboardObjective    = ln(scoreboard.AddScoreboardObjective,    n.AddScoreboardObjective)
export const RemoveScoreboardObjective = ln(scoreboard.RemoveScoreboardObjective, n.RemoveScoreboardObjective)
export const GetScores                 = ln(scoreboard.GetScores,                 n.GetScores)
export const GetScore                  = ln(scoreboard.GetScore,                  n.GetScore)
export const ScoreOperation            = ln(scoreboard.ScoreOperation,            n.ScoreOperation)
