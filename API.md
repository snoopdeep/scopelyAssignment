# Game State Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Player Actions

#### Move Player
```http
POST /player/move
```
Move the player to a new position on the grid.

**Request Body:**
```json
{
  "x": 1,
  "y": 0
}
```

**Response:**
```json
{
  "success": true,
  "position": {
    "x": 1,
    "y": 0
  },
  "message": "Player moved successfully"
}
```

**Error Responses:**
- 400 Bad Request: Invalid position
- 400 Bad Request: Position blocked
- 400 Bad Request: Not adjacent move

#### Get Player Status
```http
GET /player/status
```
Get the current status of the player.

**Response:**
```json
{
  "player": {
    "id": "player1",
    "position": {
      "x": 0,
      "y": 0
    },
    "health": 100,
    "inventory": [],
    "coins": 0,
    "status": "normal"
  }
}
```

#### Pick Up Item
```http
POST /player/pickup/:itemId
```
Pick up an item at the player's current position.

**Parameters:**
- `itemId` : ID of the item to pick up

**Response:**
```json
{
  "success": true,
  "item": {
    "id": "item_01",
    "type": "coin",
    "value": 10
  },
  "inventory": ["item_01"]
}
```

**Error Responses:**
- 400 Bad Request: Item not found
- 400 Bad Request: Item already picked up
- 400 Bad Request: Player not at item location

#### Use Item
```http
POST /player/use/:itemId
```
Use an item from the player's inventory.

**Parameters:**
- `itemId` : ID of the item to use

**Response:**
```json
{
  "success": true,
  "effect": "Item used",
  "playerStats": {
    "health": 100,
    "status": "normal"
  }
}
```

**Error Responses:**
- 400 Bad Request: Item not in inventory
- 400 Bad Request: Item cannot be used

#### Drop Item
```http
POST /player/drop/:itemId
```
Drop an item from inventory at current position.

**Parameters:**
- `itemId` : ID of the item to drop

**Request Body:**
```json
{
  "x": 1,
  "y": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item dropped"
}
```

**Error Responses:**
- 400 Bad Request: Item not in inventory
- 400 Bad Request: Invalid drop position

#### Get Inventory
```http
GET /player/inventory
```
Get the player's current inventory with item details.

**Response:**
```json
{
  "inventory": ["item_01", "item_02"],
  "itemDetails": {
    "item_01": {
      "id": "item_01",
      "type": "coin",
      "value": 10
    },
    "item_02": {
      "id": "item_02",
      "type": "healthPack",
      "value": 25
    }
  }
}
```

### Environment Interaction

#### Interact with Environment
```http
POST /environment/interact/:objectId
```
Interact with an environment object (door, switch, chest, etc.).

**Parameters:**
- `objectId` : ID of the environment object

**Request Body:**
```json
{
  "action": "toggle"
}
```

**Response:**
```json
{
  "success": true,
  "result": "Interaction successful",
  "objectState": {
    "id": "door_01",
    "type": "door",
    "state": "open"
  }
}
```

**Error Responses:**
- 400 Bad Request: Object not found
- 400 Bad Request: Player not at object location
- 400 Bad Request: Key required
- 400 Bad Request: Not enough coins (for teleporter)

### Game State Management

#### Get World State
```http
GET /world/state
```
Get the complete current game state.

**Response:**
```json
{
  "player": { ... },
  "items": { ... },
  "environment": { ... },
  "metadata": { ... }
}
```

#### Save Game State
```http
POST /game/save
```
Save the current game state to a file.

**Request Body:**
```json
{
  "filename": "save1.json"
}
```

**Response:**
```json
{
  "success": true,
  "savedAs": "save1.json",
  "timestamp": "2024-03-14T12:00:00Z"
}
```

**Error Responses:**
- 500 Internal Server Error: Save failed

#### Load Game State
```http
POST /game/load
```
Load a saved game state from a file.

**Request Body:**
```json
{
  "filename": "save1.json"
}
```

**Response:**
```json
{
  "success": true,
  "gameState": { ... },
  "message": "Game loaded successfully"
}
```

**Error Responses:**
- 400 Bad Request: Filename required
- 500 Internal Server Error: Load failed

#### List Saves
```http
GET /game/saves
```
Get a list of available save files.

**Response:**
```json
{
  "saves": ["save1.json", "save2.json"],
  "current": "gameState.json"
}
```

#### Reset Game State
```http
POST /game/reset
```
Reset the game state to initial configuration.

**Response:**
```json
{
  "success": true,
  "newState": { ... },
  "message": "Game reset to initial state"
}
```

#### Get Game Info
```http
GET /game/info
```
Get game metadata and statistics.

**Response:**
```json
{
  "metadata": {
    "gameId": "game_12345",
    "version": "1.0.0",
    "timestamp": "2024-03-14T12:00:00Z"
  },
  "statistics": {
    "actionsCount": 42
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limit Response
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```