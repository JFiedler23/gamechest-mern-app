import { createContext } from 'react';

const MainContext = createContext({
    newGameAdded: true | false,
    toggleNewGameAdded: () => null,
    gameInDb: true | false,
    toggleGameInDb: () => null
});

export default MainContext;