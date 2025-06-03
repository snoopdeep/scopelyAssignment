# Game State Management System

## Quick Overview
This is a 2D grid-based adventure game where players can:
- Move around a grid-based world
- Collect items like coins, health packs, and keys
- Interact with environment objects (doors, chests, switches)
- Manage inventory and use items
- Save and load game progress

## Postman API Documents 

```https://documenter.getpostman.com/view/32714719/2sB2qi7cxH```

# 2D Game State Management System

A robust system for managing the state of a simple 2D game, focusing on state representation, transitions, and persistence.

## Features

- Player state management (position, health, inventory)
- Item system with pickup and usage mechanics
- Environment interaction (doors, switches, chests)
- State persistence with save/load functionality
- Security middleware (rate limiting, CORS, helmet)

## Project Structure

```
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
|   └── middleware      # middleware functions
├── data/              # Game state data
├── config/            # Configuration files
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3000 in development mode.

## API Endpoints

### Player Actions
- `POST /api/player/move` - Move player to new position
- `GET /api/player/status` - Get player status
- `POST /api/player/pickup/:itemId` - Pick up an item
- `POST /api/player/use/:itemId` - Use an item
- `POST /api/player/drop/:itemId` - Drop an item
- `GET /api/player/inventory` - Get player inventory

### Environment Interaction
- `POST /api/environment/interact/:objectId` - Interact with environment objects

### Game State
- `GET /api/world/state` - Get complete game state
- `POST /api/game/save` - Save game state
- `POST /api/game/load` - Load game state
- `POST /api/game/reset` - Reset game state

## Design Choices

### Data Structure
- Used JSON for state representation due to:
  - Human readability
  - Easy serialization/deserialization
  - Flexible schema
  - Native JavaScript support

### State Management
- Centralized state service for all state modifications
- Validation before state changes
- Immutable state updates
- Clear separation of concerns

### Error Handling
- Custom error types for different scenarios
- Global error handler
- Detailed error messages
- Proper HTTP status codes

## Edge Cases Handled

1. Invalid State Transitions:
   - Position validation
   - Item existence checks
   - Inventory validation
   - Environment object validation

2. Data Validation:
   - Health bounds checking
   - Position bounds checking
   - Item ID validation
   - Save file corruption handling

3. State Reset:
   - Complete state reset functionality
   - Preserves initial configuration

## Extensibility

The system is designed to be easily extensible:

1. Adding New Items:
   - Extend items object in state
   - Add item-specific logic in stateService
   - No changes needed to core structure

2. Adding New Environment Objects:
   - Extend environment object in state
   - Add interaction logic in interactWithEnvironment
   - Maintains existing validation

3. Adding New Player Attributes:
   - Extend player object in state
   - Add validation in stateService
   - No breaking changes to existing code

## Reflection and Rationale

### Design Choices

1. State Representation:
   - Chose JSON for its simplicity and flexibility
   - Considered using a database but opted for file-based storage for simplicity

2. Code Organization:
   - MVC pattern for clear separation of concerns
   - Service layer for business logic
   - Utility functions for common operations

### Trade-offs

1. Performance vs Readability:
   - Chose readable code over micro-optimizations
   - Used clear variable names over shorter ones
   - Prioritized maintainability

2. Memory Usage vs Code Complexity:
   - Kept state in memory for fast access
   - Could have used streaming for large states
   - Balanced between simplicity and scalability

### Areas of Uncertainty

1. Concurrency:
   - Current implementation is single-threaded
   - Could implement locking mechanism for concurrent access
   - Need to consider race conditions in future

2. State Size:
   - Current implementation loads entire state
   - Could implement partial state loading
   - Need to consider memory usage for large games

