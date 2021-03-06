import { useEffect } from 'react';
import M from 'materialize-css';

function SortMenu(props) {
  useEffect(() => {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems);
  }, []);

  const handleClick = (e) => {
    props.onSortClick(e);
  }

  return (
    <>
      <a className='dropdown-trigger' href='#' data-target='sort-dropdown'>Sort by...</a>
      <ul id="sort-dropdown" className='dropdown-content'>
        <li></li>
        <li><a id="sort_title" href="#" onClick={handleClick} style={{flexWrap: "wrap"}}>Title (A-Z)</a></li>
        <li><a id="sort_console" href="#" onClick={handleClick}>Console (A-Z)</a></li>
        <li><a id="sort_date_asc" href="#" onClick={handleClick}>Release date (oldest-newest)</a></li>
        <li><a id="sort_date_desc" href="#" onClick={handleClick}>Release date (newest-oldest)</a></li>
      </ul>
    </>
  );
}

export default SortMenu;