const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");

const gamesDirectory = path.join(__dirname, "games");

function getCatalog() {
  if (!fs.existsSync(gamesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(gamesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readGameManifest(entry.name))
    .filter(Boolean)
    .sort((left, right) => left.order - right.order || left.title.localeCompare(right.title));
}

function readGameManifest(gameId) {
  const manifestPath = path.join(gamesDirectory, gameId, "game.json");

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    return {
      id: gameId,
      title: String(manifest.title || gameId),
      description: String(manifest.description || ""),
      order: Number(manifest.order || 100),
    };
  } catch {
    return null;
  }
}

contextBridge.exposeInMainWorld("localGames", {
  getCatalog,
});
