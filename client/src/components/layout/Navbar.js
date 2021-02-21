import React from 'react';
import AddModal from '../add-modal/AddModal';

function Navbar(props) {
    /* ADD ME BACK LATER
    const searchSubmit = (e) =>{
        e.preventDefault();

        console.log(e.target.search.value);
    }
        <li>
            <form onSubmit={searchSubmit}>
                <div className="input-field">
                <input id="search" type="search" required></input>
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                <i className="material-icons">close</i>
                </div>
            </form>
        </li>
        <a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
    */

    return( 
        <nav>
            <div className="nav-wrapper red lighten-1">
                <a href="#" className="brand-logo hide-on-small-only">
                    GameChest
                    <i className="material-icons">videogame_asset</i>
                </a>
                <a href="#" className="hide-on-med-and-up">GameChest</a>
                <ul id="nav-mobile" className="right">
                    <li>
                        <AddModal modalResults={props.modalResults} onSubmit={props.onModalSubmit} closeModal={props.closeModal} />
                    </li>
                    <li><a href="#" onClick={props.logoutClick}><i className="material-icons">exit_to_app</i></a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;