import React from "react";
import PropTypes from 'prop-types';

function Card(props) {
    return(
        <div className="col s12 m6 l3">
            <div className="card large">
                <div className="card-image">
                    <img src={props.image} alt={props.title}></img>
                </div>
                <div className="card-content">
                    <span className="card-title">{props.title}</span>
                    <p>Release date: {props.releaseDate}</p>
                    <p>Platform: {props.platform}</p>
                    <p>Developers: {props.developers.toString()}</p>
                    <button onClick={(e) => {props.onDelete(props)}} className="btn-floating halfway-fab waves-effect waves-light red hoverable"><i className="material-icons">remove</i></button>
                </div>
            </div>
        </div>
    );
}

Card.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    releaseDate: PropTypes.string,
    platform: PropTypes.string
}

export default Card;