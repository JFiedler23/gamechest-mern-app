//react
import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";

//other libs
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from 'axios';

//context
import MainContext from "../../context/MainContext";

//components
import Card from './Card';
import Navbar from '../layout/Navbar';


function Dashboard(props) {
    const [gameTotal, setGameTotal] = useState(0);
    const [games, setGames] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const [modalResults, setModalResults] = useState({});
    const { toggleNewGameAdded, toggleGameInDb } = useContext(MainContext);
    const [page, setPage] = useState(1);
    const [scrollIndex, setScrollIndex] = useState(8);
    const loader = useRef(null);
    const [sorted, setSorted] = useState("default");
    const [maxScroll, setMaxScroll] = useState(false);

    const { user } = props.auth;

    const onLogoutClick = e => {
        e.preventDefault();
        props.logoutUser();
    };

    //handles game search modal submit events
    const onModalSubmit = async (event) => {
        event.preventDefault(event);

        //getting array of checkbox gameChoices from search results
        const gameChoices = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value);

        const gameChoicesMap = {};

        //splitting title and platform title=game[0] platform=game[1]
        for(let i in gameChoices){
            let game = gameChoices[i].split(">");
            gameChoicesMap[game[0]] = game[1];
        }

        if(gameChoices.length === 0){
            try{
                let response = await axios.post('https://pure-brushlands-91141.herokuapp.com/api/games/searchGames', {searchTerm: event.target.title.value});

                setModalResults({
                    newResults: true,
                    results: response.data.games
                });
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            let results = modalResults.results;
            let games = [];

            //getting all of the users choices
            for(let i in results){
                if(gameChoicesMap[results[i]._id]){
                    games.push(results[i]);
                }
            }

            //clearing results
            setModalResults({
                newResults: false,
                results: []
            });

            try{
                let response = await axios.post('https://pure-brushlands-91141.herokuapp.com/api/games/add', {userId: user.id, games: games});

                if(response.data.success){
                    toggleNewGameAdded(true);
                    
                    //adding new games to ui if all games are present
                    if(allGames){
                        setAllGames([...allGames, ...response.data.games_added]);
                        setGames([...allGames, ...response.data.games_added]);
                        setGameTotal(gameTotal => gameTotal + response.data.games_added.length);
                        sortGames(sorted, [...allGames, ...response.data.games_added]);
                    }
                    else{
                        try{
                            await getAllGames();
                            setAllGames([...allGames, ...response.data.games_added]);
                            setGames([...allGames, ...response.data.games_added]);
                            setGameTotal(gameTotal => gameTotal + response.data.games_added.length);
                            sortGames(sorted, [...allGames, ...response.data.games_added]);
                        }
                        catch(error){
                            console.log(error);
                        }
                    }
                    setTimeout(() => {
                        toggleNewGameAdded(false);
                    }, 5000);
                }
                else{
                    toggleGameInDb(true);
                    setTimeout(() => {
                        toggleGameInDb(false);
                    }, 5000);
                }
            }
            catch(error){
                console.log(error);
            }
        }
    };

    //handles game reference deletion event
    const onDeleteClick = async (cardProps) => {
        try{
            let response = await axios.post("https://pure-brushlands-91141.herokuapp.com/api/games/delete", {userId: user.id, gameId: cardProps.id});

            if(response){
                setGames(newGames => newGames.filter(game => game._id !== cardProps.id));
                setAllGames(newGames => newGames.filter(game => game._id !== cardProps.id));
                setGameTotal(current_total => current_total - 1);
            }

            if(sorted === "default"){
                getGames({userId: user.id, numGames: scrollIndex - 1, sortType: sorted});
            }
        }
        catch(error){
            console.log(error);
        }
    };

    //gets games for the current user based on scroll index
    const getGames = async (userData) => {
        let res;
        try{
            if(sorted === "default"){
                res = await axios.post('https://pure-brushlands-91141.herokuapp.com/api/games/getGames', userData)
                setMaxScroll(res.data.maxScroll);
                setGameTotal(res.data.gameTotal);
                setGames(res.data.games);
            }
        }
        catch(error){
            console.log(error);
        }
    };

    //gets all games for the current user. Used to store games client-side so sorting is faster
    const getAllGames = async() => {
        try{
            let response = await axios.post('https://pure-brushlands-91141.herokuapp.com/api/games/getGames', {userId: user.id, numGames: -1});
            setAllGames(response.data.games);
        }
        catch(error){
            console.log(error);
        }
    }

    //gets the first 8 games for the user (speeds up initial page load)
    useEffect(() => {
        getGames({userId: user.id, numGames: scrollIndex, sortType: sorted});
    }, []);

    //gets the users entire game list (used to speed up sorting)
    useEffect(() => {
        getAllGames();
    }, []);

    //sets up intersection observer for infinite scroll
    useEffect(() => {
        var options = {
           root: null,
           rootMargin: "20px",
           threshold: 1.0
        };
       // initialize IntersectionObserver
       // and attaching to Load More div
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
           observer.observe(loader.current)
        }
    }, []);

    //manages infinite scroll
    useEffect(() => {
        if(!maxScroll){
            setScrollIndex((scrollIndex) => scrollIndex + 8);
            getGames({userId: user.id, numGames: scrollIndex, sortType: sorted});
        }
    }, [page]);

    // here we handle what happens when user scrolls to Load More div
   // in this case we just update page variable
    const handleObserver = (entities) => {
        const target = entities[0];

        if (target.isIntersecting) {
            setPage((page) => page + 1);
        }
    }

    const sortGames = (sort_type, games_list) => {

        //sorting games based on sort type
        switch (sort_type) {
            case "sort_title":
                games_list = games_list.sort((a, b) => a.title > b.title ? 1 : -1);
                break;
            case "sort_date_asc":
                games_list = games_list.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1);
                break;
            case "sort_date_desc":
                games_list = games_list.sort((a, b) => a.releaseDate > b.releaseDate ? -1 : 1);
                break;
            case "sort_console":
                games_list = games_list.sort((a, b) => a.platform > b.platform ? -1 : 1);
            default:
                break;
        }

        setGames(games_list);
        setMaxScroll(true);
        setSorted(sort_type);
    }

    const onSortClick = async (event) => {
        let sortType = event.currentTarget.id;

        if(allGames){
            sortGames(sortType, allGames);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <Navbar modalResults={modalResults} onModalSubmit={onModalSubmit} logoutClick={onLogoutClick} onSortClick={onSortClick} />
                </div>
                <div className="col s12 center-align">
                    <h3>Welcome back, {user.name}</h3>
                    <h5>Your current game total is: {gameTotal}</h5>
                </div>
                {games.map((game) => {
                    return(<Card key={game._id} id={game._id} title={game.title} image={game.image} releaseDate={game.releaseDate} developers={game.developers} platform={game.platform} onDelete={onDeleteClick} />);
                })}
            </div>
            <div className="col s12 center-align" ref={loader}>
                {games.length !== gameTotal ? <h4>Loading...</h4> : <></>}
            </div>
        </div>
    );
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
