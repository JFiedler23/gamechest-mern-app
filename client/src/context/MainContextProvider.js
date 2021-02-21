import { useState } from 'react';
import MainContext from './MainContext';

function MainContextProvider({ children }){
    const [newGameAdded, setNewGameAdded] = useState(false);
    const [gameInDb, setGameInDb] = useState(false);

    const toggleNewGameAdded = (value) => {
        setNewGameAdded(value);
    }

    const toggleGameInDb = (value) => {
        setGameInDb(value);
    }

    return(
        <MainContext.Provider value={{newGameAdded, toggleNewGameAdded, gameInDb, toggleGameInDb}}>
            {children}
        </MainContext.Provider>
    )
}

export default MainContextProvider;