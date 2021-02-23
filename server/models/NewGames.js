const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewGameSchema = new Schema ({
    gamesDbId: Number,
    title: {
        type: String,
        required: true
    },
    image: String,
    releaseDate: String,
    platform: String,
    developers: [],
});

module.exports = NewGame = mongoose.model("NewGame", NewGameSchema);