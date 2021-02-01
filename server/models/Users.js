const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    games: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game"
        }
    ]
});

module.exports = User = mongoose.model("users", UserSchema);