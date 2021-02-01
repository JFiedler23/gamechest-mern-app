const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const usersRoutes = require('./routes/api/users');
const gamesRoutes = require('./routes/api/games');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

/*
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
*/
//middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//connecting to DB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Mongoose database connection successful"))
.catch(error => console.log(error));

//passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/games", gamesRoutes);

app.listen(port, () => console.log(`Server up and running on port ${port}!`));
