import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import Form from './Form';

function AddModal(props){
  useEffect(() => {
      let modal = document.querySelectorAll('.modal');
      let instance = M.Modal.init(modal);
  }, []);

  const newGameAdded = () =>{
    if(props.newGameAdded){
      return(<p className="green-text">Game(s) has been added!</p>)
    }
  }

  return(
    <>
      <a href="#addModal" className="sidenav-close modal-trigger">Add game</a>
      <div id="addModal" className="modal">
        <div className="modal-content">
          <Form onSubmit={props.onSubmit} modalResults={props.modalResults} />
          {newGameAdded()}
        </div>
      </div>
    </>
  );
}

export default AddModal;