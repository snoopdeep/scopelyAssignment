
 // validates if a position is within the game world bounds.
function isValidPosition(x, y, metadata) {
  return Number.isInteger(x) && Number.isInteger(y) &&
    x >= 0 && x < metadata.gridWidth &&
    y >= 0 && y < metadata.gridHeight;
}


// validates if a position is blocked by an environment object, checks doors, walls, and other blocking objects.
function isPositionBlocked(x, y, environment) {
  return Object.values(environment).some(obj =>
    obj.position.x === x && obj.position.y === y &&
    obj.properties.blocksMovement && obj.state === 'closed'
  );
}

function isAdjacentMove(fromX, fromY, toX, toY) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function validateGameState(state) {
  const errors = [];
  if (!state.player || typeof state.player !== 'object') {
    errors.push('Missing or invalid player object');
  }
  if (!state.items || typeof state.items !== 'object') {
    errors.push('Missing or invalid items object');
  }
  if (!state.environment || typeof state.environment !== 'object') {
    errors.push('Missing or invalid environment object');
  }
  if (!state.metadata || typeof state.metadata !== 'object') {
    errors.push('Missing or invalid metadata object');
  }
  // Additional checks can be added here

  return { valid: errors.length === 0, errors };
}


// validates if an item exists and can be picked up and checks item existence, pickup state, and position.

function isValidItemPickup(itemId, items, playerPos) {
  const item = items[itemId];
  if (!item) return false;
  if (item.pickedUp) return false;
  return item.position.x === playerPos.x && item.position.y === playerPos.y;
}


// validates if an environment object can be interacted with.
function isValidEnvironmentInteraction(objectId, environment, playerPos) {
  const obj = environment[objectId];
  if (!obj) return false;
  if (obj.position.x !== playerPos.x || obj.position.y !== playerPos.y) return false;
  if (obj.type === 'chest' && obj.state === 'looted') return false;
  return true;
}

module.exports = {
  isValidPosition,
  isPositionBlocked,
  isAdjacentMove,
  validateGameState,
  isValidItemPickup,
  isValidEnvironmentInteraction
};
