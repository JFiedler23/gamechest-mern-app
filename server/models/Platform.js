const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlatformSchema = new Schema({
    gamesdbID: Number,
    name: String,
    alias: String
});

module.exports = Platform = mongoose.model("Platform", PlatformSchema);