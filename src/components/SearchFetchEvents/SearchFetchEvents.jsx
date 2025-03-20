import axios from "axios";
import { useState } from "react";

function SearchFetchEvents( ) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

//GET request for search results
  const Search = () => {
    console.log("Fetching query:", searchQuery);
    axios
      .get(`/api/events?q=${searchQuery}`)
      .then((response) => {
        setSearchResults(response.data);
        console.log("search results", response.data);
      })
      .catch((error) => {
        console.log("Error on GET", error);
      });
  };
  
  return (
     <div className='SearchFetchEvents'>
      <div>
        <p>Search Events</p>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={Search}>Search</button>
        <p>{JSON.stringify(searchResults)}</p>
      </div> 
    </div>
  );
  }

export default SearchFetchEvents;