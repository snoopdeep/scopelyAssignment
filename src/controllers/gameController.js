const gameState = require('../models/gameState');
const stateService = require('../services/stateService');
const persistenceService = require('../services/persistenceService');

// async handler wrapper to catch and forward errors to Express error handler
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// moves the player to a new position
exports.movePlayer = asyncHandler(async (req, res) => {
  const { x, y } = req.body;
  const result = stateService.movePlayer(gameState, x, y);
  if (!result.success) return res.status(400).json(result);
  res.json({ success: true, position: gameState.player.position, message: result.message });
});

//gets the current player status
exports.getPlayerStatus = (req, res) => {
  const { player } = gameState;
  res.json({
    player: {
      id: player.id,
      position: player.position,
      health: player.health,
      inventory: player.inventory,
      coins: player.coins,
      status: player.status
    }
  });
};

//picks up an item at the player's current position
exports.pickupItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  const result = stateService.pickupItem(gameState, itemId);
  if (!result.success) return res.status(400).json(result);
  res.json({ success: true, item: gameState.items[itemId], inventory: gameState.player.inventory });
});

//uses an item from the player's inventory
exports.useItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  const result = stateService.useItem(gameState, itemId);
  if (!result.success) return res.status(400).json(result);
  res.json({ success: true, effect: result.message, playerStats: gameState.player });
});

//drops an item from inventory at specified position
exports.dropItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;
  const { x, y } = req.body;
  const result = stateService.dropItem(gameState, itemId, x, y);
  if (!result.success) return res.status(400).json(result);
  res.json({ success: true, message: result.message });
});

//gets the player's current inventory with item details
exports.getInventory = (req, res) => {
  const invDetails = {};
  gameState.player.inventory.forEach(id => {
    invDetails[id] = gameState.items[id];
  });
  res.json({ inventory: gameState.player.inventory, itemDetails: invDetails });
};

//interacts with an environment object (door, switch, chest, etc.)
exports.interactWithEnvironment = asyncHandler(async (req, res) => {
  const objectId = req.params.objectId;
  console.log(objectId);
  const { action } = req.body;
  const result = stateService.interactWithEnvironment(gameState, objectId, action);
  if (!result.success) return res.status(400).json(result);
  res.json({ success: true, result: result.message, objectState: gameState.environment[objectId] });
});

//gets the complete current game state
exports.getWorldState = (req, res) => {
  const { player, items, environment, metadata } = gameState;
  res.json({ player, items, environment, metadata });
};

//saves the current game state to a file
exports.saveGameState = asyncHandler(async (req, res) => {
  const filename = req.body.filename || 'gameState.json';
  const result = await persistenceService.saveGameState(gameState, filename);
  if (!result.success) return res.status(500).json(result);
  res.json({ success: true, savedAs: result.filename, timestamp: result.timestamp });
});

//loads a saved game state from a file
exports.loadGameState = asyncHandler(async (req, res) => {
  const filename = req.body.filename;
  if (!filename) return res.status(400).json({ success: false, message: 'Filename required' });
  const result = await persistenceService.loadGameState(gameState, filename);
  if (!result.success) return res.status(500).json(result);
  res.json({ success: true, gameState: result.gameState, message: 'Game loaded successfully' });
});

//lists all available save files
exports.listSaves = asyncHandler(async (req, res) => {
  const saves = await persistenceService.listSaves();
  res.json({ saves, current: 'gameState.json' });
});

//resets the game state to initial configuration
exports.resetGameState = asyncHandler(async (req, res) => {
  const result = stateService.resetGameState(gameState);
  if (!result.success) return res.status(500).json(result);
  res.json({ success: true, newState: gameState, message: 'Game reset to initial state' });
});

//gets game metadata and statistics
exports.getGameInfo = (req, res) => {
  res.json({ metadata: gameState.metadata, statistics: { actionsCount: gameState.metadata.actionsCount } });
};
