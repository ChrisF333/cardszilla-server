
//Game.model.js

const {Schema, model} = require('mongoose');

const gameSchema = new Schema (
    {
        name: String,
    }
)

const Game = model("Game", gameSchema);

module.exports = Game;