🇺🇸 English | [🇯🇵 日本語](README.ja.md)

# flyde-minecraft-bedrock

![screenshot](assets/images/screenshot_en.png)

A collection of nodes for controlling Minecraft Education Edition / Bedrock Edition through visual flow-based programming ([Flyde](https://github.com/flydelabs/flyde)).

Just by wiring nodes together, you can build flows that run Minecraft commands or read coordinates/state, triggered by player actions, block events, or item events. Designed for use in programming education classrooms.

## Free and open source

This repository publishes the full source code and usage guide — free for noncommercial use under the [PolyForm Noncommercial License](#license).

## Installation

Clone this repository (or use GitHub's "Download ZIP"), then `npm install`. See [USAGE.md](USAGE.md) for setup steps.

## Included nodes

- **Connection**: Connect/disconnect to a Minecraft server
- **Player events**: Chat, movement, teleport, bounce, transform, join/leave, title display, message notifications
- **Block events**: Place, break
- **Item events**: Use, acquire, craft, equip, smelt, trade
- **Mob events**: Mob interaction, target block hit detection
- **Gameplay commands**: Run command, time, weather, fill area
- **Player commands**: Get position, orientation, game mode, XP level, equipment status, online player list, tag management
- **Agent control**: Move, mine, place, and handle items with a programmable agent
- **Scoreboard**: Score/variable management
- **Info extraction**: Pull values from entity / player / item / block / mob / villager / scoreboard / world snapshots
- **Selectors / converters**: Build selector strings, convert locale names
- **Vector math**: Vector operations, distance, clamp, AABB, lerp, normalize, dot product, stringify, split

See [USAGE.md](USAGE.md) for detailed usage instructions.

## Requirements

- Minecraft Education Edition or Bedrock Edition (with WebSocket connections enabled)
- [Flyde](https://github.com/flydelabs/flyde) (VSCode extension)

## License

[PolyForm Noncommercial License 1.0.0](LICENSE.md) — Free for noncommercial use (individuals, schools, nonprofits, etc.) indefinitely. For commercial use, please contact Mming Lab. Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

If you build something with this and share it (a video, blog post, etc.), a mention of Mming Lab / flyde-minecraft-bedrock would be appreciated!
