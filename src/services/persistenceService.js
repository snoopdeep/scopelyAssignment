const fs = require('fs');
const path = require('path');
const validation = require('../utils/validation.js');

const savesDir = path.join(__dirname, '../../data/saves');

async function saveGameState(gameState, filename = 'gameState.json') {
  try {
    const validationResult = validation.validateGameState(gameState);
    if (!validationResult.valid) {
      throw new Error('Invalid game state: ' + validationResult.errors.join(', '));
    }

    gameState.metadata.timestamp = new Date().toISOString();

    const filePath = path.join(savesDir, filename);

    //backup old save if exists
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(savesDir, filename.replace('.json', `_backup_${Date.now()}.json`));
      fs.copyFileSync(filePath, backupPath);
    }

    fs.writeFileSync(filePath, JSON.stringify(gameState, null, 2), 'utf-8');

    return { success: true, filename, timestamp: gameState.metadata.timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function loadGameState(gameState, filename = 'gameState.json') {
  try {
    const filePath = path.join(savesDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error('Save file not found: ' + filename);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const loadedState = JSON.parse(fileContent);

    const validationResult = validation.validateGameState(loadedState);
    if (!validationResult.valid) {
      throw new Error('Corrupted save file: ' + validationResult.errors.join(', '));
    }

    Object.keys(gameState).forEach(key => delete gameState[key]);
    Object.assign(gameState, loadedState);

    return { success: true, gameState };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function listSaves() {
  try {
    if (!fs.existsSync(savesDir)) fs.mkdirSync(savesDir);
    const files = fs.readdirSync(savesDir);
    return files.filter(f => f.endsWith('.json'));
  } catch {
    return [];
  }
}

module.exports = {
  saveGameState,
  loadGameState,
  listSaves
};
