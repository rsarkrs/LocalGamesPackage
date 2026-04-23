# Local Games

This project is a standalone Electron app for local classic games. The app shell
owns the window, header, and game dropdown. Each game lives in its own folder
under `games/`, so game code stays separate and new games can be added without
rewriting the shell.

Current games:

- Sudoku: playable
- Solitaire: playable click-to-move Klondike
- FreeCell: playable click-to-move FreeCell

## Requirements

- Node.js for the Electron app

## Run the Desktop App

Install dependencies once:

```powershell
npm.cmd install
```

Run the standalone app:

```powershell
npm.cmd start
```

Build a Windows app:

```powershell
npm.cmd run build
```

Build a portable Windows app:

```powershell
npm.cmd run build:portable
```

Build output is created in the `dist` folder.

## Game Folder Structure

Each game folder should follow this shape:

```text
games/
  game-id/
    game.json
    game.js
    styles.css
```

`game.json` tells the app how to list the game in the dropdown:

```json
{
  "title": "My Game",
  "description": "Short description.",
  "order": 40
}
```

`game.js` exports a default game object:

```js
function mount(root, context) {
  context.setStatus("My Game ready.");
  root.innerHTML = "<div>My Game</div>";
}

function unmount() {
  // Optional cleanup before switching to another game.
}

export default {
  id: "my-game",
  title: "My Game",
  mount,
  unmount,
};
```

The app scans `games/` through `preload.js`, adds every folder with a valid
`game.json` to the dropdown, and loads that folder's `game.js` when selected.

## Project Files

- `electron-main.js`: creates the Electron desktop window
- `preload.js`: safely exposes the local game catalog to the UI
- `index.html`: app shell markup
- `app.js`: dropdown routing and game loading
- `styles.css`: shared app styles
- `games/sudoku/`: Sudoku game implementation
- `games/solitaire/`: Solitaire game implementation
- `games/freecell/`: FreeCell game implementation

## Game Controls

Sudoku:

- Type numbers into empty cells
- Use arrow keys to move around the grid
- Use Check to mark incorrect entries

Solitaire:

- Click the deck to draw cards
- Click a face-up card or stack to select it
- Click a tableau pile or foundation to move the selection
- Double-click a playable card to try sending it to a foundation

FreeCell:

- Click a card or valid descending stack to select it
- Click an empty free cell, tableau pile, or foundation to move it
- Use Auto Foundations to move currently available foundation cards
- Stack moves are limited by open free cells and empty columns
