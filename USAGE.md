🇺🇸 English | [🇯🇵 日本語](USAGE.ja.md)

# Usage

## 1. Requirements

- [VSCode](https://code.visualstudio.com/)
- VSCode extension "[Flyde](https://marketplace.visualstudio.com/items?itemName=flyde.flyde-vscode)"
- Node.js (with npm available)
- Minecraft Education Edition or Bedrock Edition (with WebSocket connections enabled)

## 2. Project setup

1. Clone this repository (or use GitHub's "Download ZIP")
2. Open a terminal inside that folder and install its dependencies

```bash
cd flyde-minecraft-bedrock
npm install
```

3. Open the `flyde-minecraft-bedrock` folder itself in VSCode (File > Open Folder)

Flyde automatically scans the open workspace for node files. Nodes from `_nodes/index.flyde.ts` will appear in the "Local" group in the Flyde editor (no build step needed).

## 3. Switch language (optional)

Node names are in English by default. To switch to Japanese or another of the 29 supported locales:

```bash
npm run lang -- ja_JP
```

This switches node names, port names, and Minecraft block/item/mob name translations across the project all at once. See the files in [_nodes/_i18n/](_nodes/_i18n/) for the full list of supported locales.

⚠️ **Switch language before you start building flows.** Port names are baked into each `.flyde` file. If you switch language after building a flow, it's not just the wires that disconnect — each node's configured values (strings, numbers, etc.) are also keyed by the old port name and get orphaned, so you'd need to redo each node's configuration, not just reconnect the wires. Decide on a language before you start.

## 4. Create a flow file

Creating a new `.flyde` file anywhere inside the `flyde-minecraft-bedrock` folder (e.g. in `flows/`) launches the Flyde editor.

Nodes from `index.flyde.ts` automatically appear in the node menu, so you can build flows by dragging and dropping them.

For a list of standard nodes provided by Flyde itself (conditionals, list operations, etc.), see [flyde-standard-nodes.md](flyde-standard-nodes.md).

Minimal example:

```
MinecraftConnect (port: 8080)
   └─ done → OnPlayerChat (active once a player is connected)
              └─ message → RunCommand (command: "say Hello!")
```

## 5. Run and connect

1. Run the flow in the Flyde editor (▶ Test Flow button)
2. A connection command appears in the log file (e.g. `/connect localhost:8080`)
3. Run that command in the Minecraft chat box
4. Once connected, the flow starts reacting to events in Minecraft

## 6. Example flows

The [examples/](examples/) folder contains ready-to-try sample flows. Copy them into your `flyde-minecraft-bedrock/flows/` folder to open them.

| File | Description |
|---|---|
| [chicken-rain.en.flyde](examples/chicken-rain.en.flyde) | Typing "chicken" in chat summons 100 chickens 10 blocks above the player |
| [block-info.ja.flyde](examples/block-info.ja.flyde) | Shows player name, coordinates, block name, and held item in chat when placing/breaking blocks. Typing "dis" in chat disconnects. Japanese node names only — switch language first (see step 3) to use it |

## Troubleshooting

- **Node doesn't appear in the menu**: Make sure you opened the `flyde-minecraft-bedrock` folder itself as the VSCode workspace root (not a parent folder containing it), and that you ran `npm install` inside it.
- **Can't connect**: Check that cheats (commands) are enabled in Minecraft and that the port number matches.
- **Flow doesn't react**: Event nodes (`On~`) only react to events that occur after connecting. Make sure you ran the flow before connecting to Minecraft.

## About the license

This package is provided under the [PolyForm Noncommercial License 1.0.0](LICENSE.md). It's free to use indefinitely for non-commercial purposes (personal learning, hobby use, schools, nonprofits, etc.). For commercial use (such as for-profit educational businesses like programming schools), please contact Mming Lab.
