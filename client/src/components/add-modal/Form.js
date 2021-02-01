import React from 'react';

export const Form = ({ onSubmit, modalResults }) => {
    let searchResults;
    
    if(modalResults.newResults){
        searchResults = modalResults.results.map((game, i) => {
            let id = `result${i}`;

            return(
                <div key={game._id} className="row">
                    <label htmlFor={id}>
                        <input id={id} type="checkbox" value={`${game._id}>${game.title}`} />
                        <span>{game.title} - {game.platform}</span>
                    </label>
                </div>
            )
        });
    }

    return (
        <div className="row">
            <form className="col s12" onSubmit={onSubmit}>
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="title">Game title</label>
                        <input className="validate" id="title" type="text" required />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <button className="btn waves-effect waves-light" type="submit">Submit</button>
                    </div>
                </div>
                {searchResults}
            </form>
        </div>
    );
};

export default Form;
