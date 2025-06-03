const validation = require('../utils/validation.js');
const initialState = require('../../data/initialState.json');

// moves the player to a new position on the grid.
function movePlayer(gameState, newX, newY) {
  if (!validation.isValidPosition(newX, newY, gameState.metadata)) {
    return { success: false, message: 'Target position out of bounds' };
  }

  if (validation.isPositionBlocked(newX, newY, gameState.environment)) {
    return { success: false, message: 'Target position is blocked' };
  }

  if (!validation.isAdjacentMove(gameState.player.position.x, gameState.player.position.y, newX, newY)) {
    return { success: false, message: 'Can only move to adjacent tiles' };
  }

  gameState.player.position = { x: newX, y: newY };
  gameState.metadata.timestamp = new Date().toISOString();
  gameState.metadata.actionsCount++;
  gameState.metadata.lastAction = `Moved to (${newX}, ${newY})`;

  return { success: true, message: 'Player moved successfully' };
}
// picks up an item at the player's current position and adds that item to inventory and updates item state and handles special items like coins and health packs.
function pickupItem(gameState, itemId) {
  const item = gameState.items[itemId];
  if (!item) return { success: false, message: 'Item does not exist' };
  if (item.pickedUp) return { success: false, message: 'Item already picked up' };

  const playerPos = gameState.player.position;
  if (item.position.x !== playerPos.x || item.position.y !== playerPos.y) {
    return { success: false, message: 'Player not at item location' };
  }

  gameState.player.inventory.push(itemId);
  item.pickedUp = true;

  if (item.type === 'coin') {
    gameState.player.coins += item.value || 0;
  } else if (item.type === 'healthPack') {
    gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + (item.value || 0));
  }

  gameState.metadata.timestamp = new Date().toISOString();
  gameState.metadata.actionsCount++;
  gameState.metadata.lastAction = `Picked up item ${itemId}`;

  return { success: true, message: 'Item picked up' };
}
//  uses an item from the player's inventory and removes consumable items after use.
function useItem(gameState, itemId) {
  if (!gameState.player.inventory.includes(itemId)) {
    return { success: false, message: 'Item not in inventory' };
  }

  const item = gameState.items[itemId];
  if (!item) return { success: false, message: 'Invalid item' };

  switch (item.type) {
    case 'healthPack':
      gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + (item.value || 0));
      break;
    case 'powerUp':
      gameState.player.status = 'boosted';
      break;
    case 'key':
      break; // keys typically used elsewhere
    default:
      return { success: false, message: 'Item cannot be used' };
  }

  if (item.type !== 'key') {
    gameState.player.inventory = gameState.player.inventory.filter(id => id !== itemId);
  }

  gameState.metadata.timestamp = new Date().toISOString();
  gameState.metadata.actionsCount++;
  gameState.metadata.lastAction = `Used item ${itemId}`;

  return { success: true, message: 'Item used' };
}

// drops an item from inventory at specified position and updates item position and pickedUp state.
function dropItem(gameState, itemId, x, y) {
  if (!gameState.player.inventory.includes(itemId)) {
    return { success: false, message: 'Item not in inventory' };
  }
  if (!validation.isValidPosition(x, y, gameState.metadata)) {
    return { success: false, message: 'Invalid drop position' };
  }

  gameState.player.inventory = gameState.player.inventory.filter(id => id !== itemId);
  const item = gameState.items[itemId];
  item.position = { x, y };
  item.pickedUp = false;

  gameState.metadata.timestamp = new Date().toISOString();
  gameState.metadata.actionsCount++;
  gameState.metadata.lastAction = `Dropped item ${itemId} at (${x}, ${y})`;

  return { success: true, message: 'Item dropped' };
}

//checks if two positions are adjacent or the same.
function isAdjacentOrSame(pos1, pos2) {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  return (dx + dy) === 1 || (dx === 0 && dy === 0);
}

//interacts with an environment object (door, switch, chest, etc.).
// handles different object types and their specific interactions and validates requirements (keys, coins) before interaction.
function interactWithEnvironment(gameState, objectId, action) {
  const obj = gameState.environment[objectId];
  if (!obj) return { success: false, message: 'Environment object not found' };

  const playerPos = gameState.player.position;
  if (!isAdjacentOrSame(playerPos, obj.position)) {
    return { success: false, message: 'Player not at or adjacent to environment object' };
  }

  switch (obj.type) {
    case 'door':
      if (obj.properties.requiresKey && !gameState.player.inventory.includes(obj.properties.requiresKey)) {
        return { success: false, message: 'Key required to open door' };
      }
      obj.state = obj.state === 'closed' ? 'open' : 'closed';
      break;
    case 'switch':
      obj.state = obj.state === 'off' ? 'on' : 'off';
      break;
    case 'chest':
      if (obj.state === 'closed') {
        if (obj.properties.requiresKey && !gameState.player.inventory.includes(obj.properties.requiresKey)) {
          return { success: false, message: 'Key required to open chest' };
        }
        obj.state = 'open';
        obj.properties.contains.forEach(itemId => {
          const item = gameState.items[itemId];
          if (item) {
            item.pickedUp = false;
            item.position = { ...obj.position };
          }
        });
      } else if (obj.state === 'open') {
        obj.state = 'looted';
      }
      break;
    case 'teleporter':
      if (gameState.player.coins < obj.properties.cost) {
        return { success: false, message: 'Not enough coins for teleport' };
      }
      gameState.player.coins -= obj.properties.cost;
      gameState.player.position = { ...obj.properties.destination };
      break;
    default:
      return { success: false, message: 'Unhandled environment object type' };
  }

  gameState.metadata.timestamp = new Date().toISOString();
  gameState.metadata.actionsCount++;
  gameState.metadata.lastAction = `Interacted with ${objectId}`;

  return { success: true, message: 'Interaction successful' };
}

// resets the game state to initial configuration and deep clones the initial state to prevent reference issues.
function resetGameState(gameState) {
  Object.keys(gameState).forEach(key => delete gameState[key]);
  Object.assign(gameState, JSON.parse(JSON.stringify(initialState)));
  gameState.metadata.timestamp = new Date().toISOString();
  gameState.metadata.actionsCount = 0;
  gameState.metadata.lastAction = 'Game reset';
  return { success: true, message: 'Game reset to initial state' };
}

module.exports = {
  movePlayer,
  pickupItem,
  useItem,
  dropItem,
  interactWithEnvironment,
  resetGameState
};
