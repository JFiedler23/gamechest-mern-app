import React, { useEffect, useContext } from 'react';
import M from 'materialize-css';
import Form from './Form';
import MainContext from '../../context/MainContext';

function AddModal(props){
  const { newGameAdded, gameInDb } = useContext(MainContext)

  useEffect(() => {
      let modal = document.querySelectorAll('.modal');
      let instance = M.Modal.init(modal);
  }, []);

  return(
    <>
      <a href="#addModal" className="sidenav-close modal-trigger">Add game</a>
      <div id="addModal" className="modal">
        <div className="modal-content">
          <Form onSubmit={props.onSubmit} modalResults={props.modalResults} />
          {newGameAdded ? <p className="green-text">Game(s) has been added!</p> : <></>}
          {gameInDb ? <p className="red-text">Game not added. Game is already in your collection</p> : <></>}
        </div>
      </div>
    </>
  );
}

export default AddModal;