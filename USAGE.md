🇺🇸 English | [🇯🇵 日本語](USAGE.ja.md)

# Usage

## 1. Requirements

- [VSCode](https://code.visualstudio.com/)
- VSCode extension "[Flyde](https://marketplace.visualstudio.com/items?itemName=flyde.flyde-vscode)"
- Node.js (with npm available)
- Minecraft Education Edition or Bedrock Edition (with WebSocket connections enabled)

## 2. Project setup

1. Download and extract the zip — this gives you a `flyde-minecraft-bedrock-nodes` folder
2. Open a terminal inside that folder and install its dependencies

```bash
cd flyde-minecraft-bedrock-nodes
npm install
```

3. Open the `flyde-minecraft-bedrock-nodes` folder itself in VSCode (File > Open Folder)

Flyde automatically scans the open workspace for node files. Nodes from `build/` will appear in the "Local" group in the Flyde editor.

This is the same procedure for the Full Edition (after purchase).

## 3. Create a flow file

Creating a new `.flyde` file anywhere inside the `flyde-minecraft-bedrock-nodes` folder (e.g. in `flows/`) launches the Flyde editor.

Nodes from `build/index.flyde.js` automatically appear in the node menu, so you can build flows by dragging and dropping them.

For a list of standard nodes provided by Flyde itself (conditionals, list operations, etc.), see [flyde-standard-nodes.md](flyde-standard-nodes.md).

Minimal example:

```
MinecraftConnect (port: 8080)
   └─ done → OnPlayerChat (active once a player is connected)
              └─ message → RunCommand (command: "say Hello!")
```

## 4. Run and connect

1. Run the flow in the Flyde editor (▶ Test Flow button)
2. A connection command appears in the log file (e.g. `/connect localhost:8080`)
3. Run that command in the Minecraft chat box
4. Once connected, the flow starts reacting to events in Minecraft

## 5. Example flows

The [examples/](examples/) folder contains ready-to-try sample flows. Copy them into your `flyde-minecraft-bedrock-nodes/flows/` folder to open them. Note: these are currently only available with Japanese node names (`.ja.flyde`); more languages may be added later.

| File | Description |
|---|---|
| [chicken-rain.en.flyde](examples/chicken-rain.ja.flyde) | Typing "chicken" in chat summons 100 chickens 10 blocks above the player |

## Troubleshooting

- **Node doesn't appear in the menu**: Make sure you opened the `flyde-minecraft-bedrock-nodes` folder itself as the VSCode workspace root (not a parent folder containing it), that you ran `npm install` inside it, and that `flyde-minecraft-bedrock-nodes/build/` contains the built JS file.
- **Can't connect**: Check that cheats (commands) are enabled in Minecraft and that the port number matches.
- **Flow doesn't react**: Event nodes (`On~`) only react to events that occur after connecting. Make sure you ran the flow before connecting to Minecraft.

## About the license

This package is provided under the [Prosperity Public License 3.0.0](LICENSE.md). It's free to use indefinitely for non-commercial purposes (personal learning, hobby use, schools, nonprofits, etc.). Commercial use (such as for-profit educational businesses like programming schools) gets a 30-day free trial, after which a paid Patron License (Full Edition) is required.

The Full Edition, which includes commercial use rights and features like agent control and scoreboard, will be sold via ~~[Gumroad](#)~~ / ~~[BOOTH](#)~~ (coming soon).
