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
    const [modalResults, setModalResults] = useState({});
    const { toggleNewGameAdded, toggleGameInDb } = useContext(MainContext);
    const [page, setPage] = useState(1);
    const [scrollIndex, setScrollIndex] = useState(8);
    const loader = useRef(null);
    const [sorted, setSorted] = useState("default");
    const [maxScroll, setMaxScroll] = useState(false);

    const { user } = props.auth;
    const userData = {userId: user.id};

    const onLogoutClick = e => {
        e.preventDefault();
        props.logoutUser();
    };

    //handles game search modal submit events
    const onModalSubmit = (event) => {
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
            //searching for game
            axios
            .post('https://pure-brushlands-91141.herokuapp.com/api/games/searchGames', {searchTerm: event.target.title.value})
            .then(res => {
                setModalResults({
                    newResults: true,
                    results: res.data.games
                });
            })
            .catch(err => {
                console.log(err);
            })
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

            let data = {userId: user.id, games: games};

            //clearing results
            setModalResults({
                newResults: false,
                results: []
            });

            axios
            .post('https://pure-brushlands-91141.herokuapp.com/api/games/add', data)
            .then(res => {
                console.log(games);
                data = {userId: user.id, sortType: sorted, numGames: scrollIndex}
                console.log(data);
                //if game is not already in users collection. Add it to their collection
                if(res.data.success){
                    toggleNewGameAdded(true);
                    getGames(data).then(res => {
                        setTimeout(() => {
                            toggleNewGameAdded(false);
                        }, 5000);
                    }).catch(err => console.log(err));
                }
                else{
                    toggleGameInDb(true);
                    setTimeout(() => {
                        toggleGameInDb(false);
                    }, 5000);
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    };

    //handles game reference deletion event
    const onDeleteClick = (cardProps) => {
        axios
        .post("https://pure-brushlands-91141.herokuapp.com/api/games/delete", {userId: user.id, gameId: cardProps.id})
        .then(res => {
            getGames({userId: user.id, numGames: scrollIndex - 1, sortType: sorted}).then(res => {}).catch(err => {console.log(err)});
        })
        .catch(err => {
            console.log(err);
        });
    };

    //gets all games for the current user
    const getGames = async (userData) => {
        let res;
        if(sorted === "default"){
            res = await axios.post('https://pure-brushlands-91141.herokuapp.com/api/games/getGames', userData)
            setMaxScroll(res.data.maxScroll);
        }
        else{
            res = await axios.post("https://pure-brushlands-91141.herokuapp.com/api/games/sortGames", userData);
            setMaxScroll(res.data.maxScroll);
        }
        
        setGameTotal(res.data.gameTotal);
        setGames(res.data.games);
    };

    //runs once when the component mounts
    useEffect(() => {
        getGames({userId: user.id, numGames: scrollIndex, sortType: sorted});
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

    //Creating games list using Card component
    const GameItems = games.map((game) => {
        return(<Card key={game._id} id={game._id} title={game.title} image={game.image} releaseDate={game.releaseDate} developers={game.developers} platform={game.platform} onDelete={onDeleteClick} />);
    });

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

    const onSortClick = async (event) => {
        var sortType = event.currentTarget.id;
        setScrollIndex(16);

        let { data } = await axios.post("https://pure-brushlands-91141.herokuapp.com/api/games/sortGames", {userId: user.id, sortType: sortType, numGames: 8});
        
        if(data.success){
            setSorted(sortType);
            setGames(data.games);
            setMaxScroll(data.maxScroll);
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
                {GameItems}
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
