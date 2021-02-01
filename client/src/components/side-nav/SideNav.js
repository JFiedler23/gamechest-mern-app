import React, { useEffect } from 'react';
import M from "materialize-css";
import AddModal from '../add-modal/AddModal';

function SideNav(props) {
    useEffect(() => {
        let elems = document.querySelectorAll('.sidenav');
        let instance = M.Sidenav.init(elems, {
            edge: "left",
            inDuration: 250
        });
    }, []);
    return(
        <div className="row">
            <ul id="slide-out" className="sidenav red lighten-1">
                <li><AddModal modalResults={props.modalResults} onSubmit={props.onModalSubmit} closeModal={props.closeModal} /></li>
                <li><a href="#!" className="sidenav-close" style={{color: "white"}} onClick={props.logoutClick}>Logout</a></li>
            </ul>
        </div>   
    );
}

export default SideNav;