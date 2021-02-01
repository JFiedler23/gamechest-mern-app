const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    image: String,
    releaseDate: String,
    platform: String
});

module.exports = Game = mongoose.model("Game", GameSchema);