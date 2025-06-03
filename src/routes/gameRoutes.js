const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// player movement
router.post('/player/move', gameController.movePlayer);

// player status
router.get('/player/status', gameController.getPlayerStatus);

// inventory
router.post('/player/pickup/:itemId', gameController.pickupItem);
router.post('/player/use/:itemId', gameController.useItem);
router.post('/player/drop/:itemId', gameController.dropItem);
router.get('/player/inventory', gameController.getInventory);

// environment interaction
router.post('/environment/interact/:objectId', gameController.interactWithEnvironment);

// world state
router.get('/world/state', gameController.getWorldState);

// game save/load/reset
router.post('/game/save', gameController.saveGameState);
router.post('/game/load', gameController.loadGameState);
router.get('/game/saves', gameController.listSaves);
router.post('/game/reset', gameController.resetGameState);

// game info
router.get('/game/info', gameController.getGameInfo);

module.exports = router;
