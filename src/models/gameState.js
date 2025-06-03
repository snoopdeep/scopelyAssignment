const initialState = require('../../data/initialState.json');

const gameState = JSON.parse(JSON.stringify(initialState)); // deep clone initial state

module.exports = gameState;
