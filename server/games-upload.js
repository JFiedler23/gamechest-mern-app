
const Games = require('./models/Games');
const Platform = require('./models/Platform');
const Users = require('./models/Users');
const { games } = require('../../games-db-mirror.json');

Users.findById("601202ea6532532690e8545a", function (err, user) {
    if(err){
        console.log(err);
        return;
    }

    console.log(user);
});

/*
const getPlatform = async (platform) => {
    return await Platform.findOne({gamesdbID: platform}).exec();
}

const getAllPlaftorms = async () =>{
    let platforms = [];

    for(let i in games){
        let platform = await getPlatform(games[i].platform);
        games[i].platform = platform.name;
    }

    return games
}

getAllPlaftorms().then(data => {
    console.log(data);
})
.catch(err => {
    console.log(err);
});

const newGame = new Game({
        title: body.game_title,
        image: imageURL,
        releaseDate: body.release_date,
        platform: body.platform
});

if(!newGame){
    return res.status(400).json({
        success: false,
        error: err,
    });
}

newGame.save()
.then(game => {
    updateUser(body.userId, game._id);
    return res.status(200).json({
        success: true,
        message: "Game added"
    });
})
.catch(err => {
    return res.status(400).json({
        err,
        message: "Game not added"
    })
});
*/