const gameSelect = document.querySelector("#game-select");
const gameTitle = document.querySelector("#game-title");
const gameStatus = document.querySelector("#game-status");
const gameRoot = document.querySelector("#game-root");

let activeGame = null;
let activeStyle = null;

function setStatus(message) {
  gameStatus.textContent = message;
}

function getCatalog() {
  if (window.localGames?.getCatalog) {
    return window.localGames.getCatalog();
  }

  return [
    { id: "sudoku", title: "Sudoku", description: "Number puzzle" },
    { id: "solitaire", title: "Solitaire", description: "Card game" },
    { id: "freecell", title: "FreeCell", description: "Card game" },
  ];
}

function populateGameSelect(catalog) {
  gameSelect.innerHTML = "";

  catalog.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.id;
    option.textContent = game.title;
    gameSelect.appendChild(option);
  });
}

async function loadGame(gameId) {
  if (activeGame?.unmount) {
    activeGame.unmount();
  }

  gameRoot.innerHTML = "";
  gameTitle.textContent = "Loading";
  setStatus("Preparing game.");
  loadGameStyles(gameId);

  try {
    const module = await import(`./games/${gameId}/game.js`);
    activeGame = module.default;
    gameTitle.textContent = activeGame.title;
    document.title = `Local Games - ${activeGame.title}`;
    activeGame.mount(gameRoot, { setStatus });
  } catch (error) {
    activeGame = null;
    gameTitle.textContent = "Local Games";
    setStatus(`Could not load ${gameId}.`);
    gameRoot.innerHTML = `<div class="placeholder-game"><div><h2>Game unavailable</h2><p>${escapeHtml(error.message)}</p></div></div>`;
  }
}

function loadGameStyles(gameId) {
  if (activeStyle) {
    activeStyle.remove();
  }

  activeStyle = document.createElement("link");
  activeStyle.rel = "stylesheet";
  activeStyle.href = `games/${gameId}/styles.css`;
  activeStyle.dataset.gameStyle = gameId;
  document.head.appendChild(activeStyle);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function start() {
  const catalog = getCatalog();
  populateGameSelect(catalog);

  gameSelect.addEventListener("change", () => {
    loadGame(gameSelect.value);
  });

  const firstGame = catalog[0]?.id;
  if (firstGame) {
    gameSelect.value = firstGame;
    loadGame(firstGame);
  } else {
    gameTitle.textContent = "Local Games";
    setStatus("No games found.");
  }
}

start();
