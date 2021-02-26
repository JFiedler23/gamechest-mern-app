const express = require('express');
const NewGame = require('../../models/NewGames');
const User = require('../../models/Users');
const router = express.Router();

var gamesState = [];

//helper function used to update the user for add route
const updateUser = (id, gameId) => {
    User.findByIdAndUpdate(
        id,
        { $push: { games: gameId } },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if(err){
                return {
                    success: false,
                    error: err
                };
            }

            return {
                success: true,
                id: gameId,
                message: "Game added"
            };
        }
    );
}

const searchGames = async (searchTerm) => {
    let allGames = await NewGame.find({ title: { "$regex": searchTerm, "$options": "i" } });

    return allGames;
}

const getAllGames = async (ids) => {
    let games = [];

    for(let i in ids){
        let game = await NewGame.findById(ids[i]);
        games.push(game);
    }

    return games;
}

// @route POST api/games/searchGames
// @desc Utility request used to get games from the games DB
// @access Public
router.post('/searchGames', async (req, res) => {
    const body = req.body;

    if(!body){
        return res.status(400).json({
            success: false,
            error: err
        });
    }

    let allGames = await searchGames(body.searchTerm);

    return res.status(200).json({
        success: true,
        games: allGames
    });
});

// @route POST api/games/add
// @desc Add game to DB and create reference in User document
// @access Public
router.post("/add", async (req, res) =>{
    const body = req.body;
    let isGameAdded = false;

    if(!body){
        return res.status(400).json({
            success: false,
            error: err
        });
    }

    for(let i in body.games){
        const game = await NewGame.findOne({_id: body.games[i]._id});
        
        if(game){
            const usersFound = await User.find({games: game._id});
            const foundGame = usersFound.find(user => user._id == body.userId);

            //game was found do not add
            if(foundGame){
                console.log("Do not add game!");
                console.log(game);
            }
            else{
                updateUser(body.userId, game._id);
                isGameAdded = true;
            } 
        }
    }

    if(isGameAdded){
        return res.status(200).json({
            success: true,
            message: "Game(s) added"
        });
    }
    else{
        return res.status(200).json({
            success: false,
            message: "Game(s) already in your collection!"
        });
    }
});

// @route DELETE api/games/delete
// @desc Removes game reference from user
// @access Public
router.post('/delete', (req, res) => {
    const body = req.body;

    if(!body){
        return res.status(400).json({
            success: false,
            error: err
        });
    }

    //removing game reference from user
    User.findByIdAndUpdate(
        body.userId,
        { $pull: { games: body.gameId } },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: "Game reference removed from user"
            });
        }
    );
});

// @route POST api/games/getGames
// @desc Gets all games for a user
// @access Public
router.post('/getGames', (req, res) => {
    const body = req.body;

    if(!body){
        return res.status(400).json({
            success: false,
            error: "Error in body"
        });
    }

    User.findById(body.userId, (err, user) => {
        if(!user){
            return res.status(400).json({
                success: false,
                error: err
            });
        }
        //getting games list for user
        let gameIDs = user.games.slice(0, body.numGames);
    
        //getting all games from DB
        getAllGames(gameIDs).then(gamesList => {
            return res.status(200).json({
                success: true,
                games: gamesList,
                gameTotal: user.games.length,
                maxScroll: user.games.length === gamesList.length ? true : false
            });
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                error: err
            });
        });
    });
});

// @route POST api/games/getGames
// @desc Gets all games for a user
// @access Public
router.post('/sortGames', (req, res) => {
    const body = req.body;

    if(!body || !body.userId || !body.sortType){
        return res.status(400).json({
            success: false,
            message: "Incorrect request body"
        });
    }

    User.findById(body.userId, async (err, user) => {
        if(err){
            return res.status(400).json({
                success: false,
                error: err
            });
        }

        let games = await getAllGames(user.games);
        let sortedGames = [];
        
        //sorting games based on sort type
        switch (body.sortType) {
            case "sort_title":
                sortedGames = games.sort((a, b) => a.title > b.title ? 1 : -1);
                break;
            case "sort_date_asc":
                sortedGames = games.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1);
                break;
            case "sort_date_desc":
                sortedGames = games.sort((a, b) => a.releaseDate > b.releaseDate ? -1 : 1);
                break;
            default:
                break;
        }
        sortedGames = sortedGames.slice(0, body.numGames);

        return res.status(200).json({
            success: true,
            games: sortedGames,
            gameTotal: user.games.length,
            maxScroll: user.games.length === sortedGames.length ? true : false
        });
    })
})

module.exports = router;