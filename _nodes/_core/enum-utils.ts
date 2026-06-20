const TRAVEL_METHOD: Record<number, string> = {
  0: 'Walk', 1: 'SwimWater', 2: 'Fall',   3: 'Climb',    4: 'SwimLava',
  5: 'Fly',  6: 'Riding',   7: 'Sneak',   8: 'Sprint',   9: 'Bounce',
  10: 'FrostWalk', 11: 'Teleport',
}

const TELEPORT_CAUSE: Record<number, string> = {
  1: 'Projectile', 2: 'ChorusFruit', 3: 'Command', 4: 'Behavior',
}

const MOB_INTERACTION: Record<number, string> = {
  1: 'Breeding', 2: 'Taming',     3: 'Curing',      4: 'Crafted',
  5: 'Shearing', 6: 'Milking',    7: 'Trading',      8: 'Feeding',
  9: 'Igniting', 10: 'Coloring',  11: 'Naming',      12: 'Leashing',
  13: 'Unleashing', 14: 'PetSleep', 15: 'Trusting',  16: 'Commanding',
}

const ITEM_USE_METHOD: Record<number, string> = {
  0: 'Use', 1: 'Place',
}

const ITEM_ACQ_METHOD: Record<number, string> = {
  1: 'Pickedup', 2: 'Crafted',  3: 'TakenFromChest',      4: 'TakenFromEnderChest',
  5: 'Bought',   6: 'Anvil',    7: 'Smelted',              8: 'Brewed',
  9: 'Filled',   10: 'Trading', 11: 'Fishing',             13: 'Container',
  14: 'Feeding',
}

const EQUIP_SLOT: Record<number, string> = {
  1: 'Offhand', 2: 'Head', 3: 'Chest', 4: 'Legs', 5: 'Feet',
}

const DESTRUCTION_METHOD: Record<number, string> = {
  0: 'Player',
  1: 'Explosion',
  2: 'Mob',
  3: 'Piston',
  4: 'Other',
}

const PLACEMENT_METHOD: Record<number, string> = {
  0: 'Player',
  1: 'Other',
}

const BIOME_NAMES: Record<number, string> = {
  0:   'Ocean',
  1:   'Plains',
  2:   'Desert',
  3:   'ExtremeHills',
  4:   'Forest',
  5:   'Taiga',
  6:   'Swampland',
  7:   'River',
  8:   'Hell',
  9:   'TheEnd',
  10:  'LegacyFrozenOcean',
  11:  'FrozenRiver',
  12:  'IcePlains',
  13:  'IceMountains',
  14:  'MushroomIsland',
  15:  'MushroomIslandShore',
  16:  'Beach',
  17:  'DesertHills',
  18:  'ForestHills',
  19:  'TaigaHills',
  20:  'ExtremeHillsEdge',
  21:  'Jungle',
  22:  'JungleHills',
  23:  'JungleEdge',
  24:  'DeepOcean',
  25:  'StoneBeach',
  26:  'ColdBeach',
  27:  'BirchForest',
  28:  'BirchForestHills',
  29:  'RoofedForest',
  30:  'ColdTaiga',
  31:  'ColdTaigaHills',
  32:  'MegaTaiga',
  33:  'MegaTaigaHills',
  34:  'ExtremeHillsPlusTrees',
  35:  'Savanna',
  36:  'SavannaPlateau',
  37:  'Mesa',
  38:  'MesaPlateauStone',
  39:  'MesaPlateau',
  40:  'WarmOcean',
  41:  'LukewarmOcean',
  42:  'ColdOcean',
  43:  'DeepWarmOcean',
  44:  'DeepLukewarmOcean',
  45:  'DeepColdOcean',
  46:  'DeepFrozenOcean',
  47:  'FrozenPeaks',
  48:  'SnowySlopes',
  49:  'StonyPeaks',
  50:  'JaggedPeaks',
  51:  'Meadow',
  52:  'Grove',
  53:  'LushCaves',
  54:  'DripstoneCaves',
  55:  'DeepDark',
  56:  'MangroveSwamp',
  57:  'CherryGrove',
  58:  'PaleGarden',
  129: 'SunflowerPlains',
  130: 'DesertMutated',
  131: 'ExtremeHillsMutated',
  132: 'FlowerForest',
  133: 'TaigaMutated',
  134: 'SwamplandMutated',
  140: 'IcePlainsSpikes',
  149: 'JungleMutated',
  151: 'JungleEdgeMutated',
  155: 'BirchForestMutated',
  156: 'BirchForestHillsMutated',
  157: 'RoofedForestMutated',
  158: 'ColdTaigaMutated',
  160: 'RedwoodTaigaMutated',
  161: 'RedwoodTaigaHillsMutated',
  162: 'ExtremeHillsPlusTreesMutated',
  163: 'SavannaMutated',
  164: 'SavannaPlateauMutated',
  165: 'MesaBryce',
  166: 'MesaPlateauStoneMutated',
  167: 'MesaPlateauMutated',
  168: 'BambooJungle',
  169: 'BambooJungleHills',
  177: 'SoulsandValley',
  178: 'CrimsonForest',
  179: 'WarpedForest',
  180: 'BasaltDeltas',
}

/** kind 名は英語キーに統一（TravelMethod, TeleportCause, ...） */
export function toEnumString(kind: string, value: number): string {
  switch (kind) {
    case 'TravelMethod':     return TRAVEL_METHOD[value]     ?? String(value)
    case 'TeleportCause':    return TELEPORT_CAUSE[value]    ?? String(value)
    case 'MobInteraction':   return MOB_INTERACTION[value]   ?? String(value)
    case 'ItemAcqMethod':    return ITEM_ACQ_METHOD[value]   ?? String(value)
    case 'ItemUseMethod':    return ITEM_USE_METHOD[value]   ?? String(value)
    case 'EquipSlot':        return EQUIP_SLOT[value]        ?? String(value)
    case 'BlockBreakMethod': return DESTRUCTION_METHOD[value] ?? String(value)
    case 'BlockPlaceMethod': return PLACEMENT_METHOD[value]  ?? String(value)
    case 'biome':            return BIOME_NAMES[value]       ?? String(value)
    default:                 return String(value)
  }
}
