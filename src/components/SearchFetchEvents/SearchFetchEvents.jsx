import axios from "axios";
import { useState, useEffect } from "react";
import useStore from '../../zustand/store';

function SearchFetchEvents( ) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchEvents = useStore((state)=> state.searchEvents);
  const fetchEvents = useStore((state)=> state.fetchEvents);

   useEffect(() =>{
     fetchEvents();
  }, [fetchEvents] );

//GET request for search results
  // const search = () => {
  //   console.log("Fetching query:", searchQuery);
  //   axios.get(`/api/events?q=${searchQuery}`).then((response) => {
  //     setSearchResults(response.data);
  //     console.log("search results", response.data);
  //     searchEvents();
  //     }).catch((error) => {
  //       console.log("Error on GET", error);
  //     });
  // };


  // // POST search request
  // function addSearch () {
  //   console.log( 'addSearch' );
  //   axios.post( '/api/events' ).then(function( respones ){
  //     console.log( response.data )
  //     searchEvents();
  //   }).catch( function( err ){
  //       console.log( err );
  //       alert( 'error creating new todo' );
  //   })
  // }


  
  // // POST search request
  function addSearch () {
    const objectToSend = {
      location: location
    }
    console.log( 'addSearch' );
    axios.post( '/api/events' ).then(function( respones ){
      console.log( response.data )
      searchEvents();
    }).catch( function( err ){
        console.log( err );
        alert( 'error creating new todo' );
    })
  }
  
  return (
     <div className='SearchFetchEvents'>
      <div>
        <p>Search Events</p>
        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        <button onClick={ searchEvents }>Search</button>
        <p>{ location }</p>
        <button onClick={ addSearch }>Search</button>
        <p>{JSON.stringify(searchResults)}</p>
      </div> 
    </div>
  );
  }

export default SearchFetchEvents;

  // Search events UserSlice
  // searchEvents: async (searchQuery, categoryId) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     let url = '/api/events/search?';
      
  //     if (searchQuery) {
  //       url += `query=${encodeURIComponent(searchQuery)}`;
  //     }
      
  //     if (categoryId) {
  //       url += `${searchQuery ? '&' : ''}category=${categoryId}`;
  //     }
      
  //     const { data } = await axios.get(url);
  //     set({ events: data, isLoading: false });
  //   } catch (err) {
  //     console.log('searchEvents error:', err);
  //     set({ error: 'Failed to search events', isLoading: false });
  //   }
  // },

// function SearchFetchEvents( ) {
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

// //GET request for search results
//   const Search = () => {
//     console.log("Fetching query:", searchQuery);
//     axios
//       .get(`/api/events?q=${searchQuery}`)
//       .then((response) => {
//         setSearchResults(response.data);
//         console.log("search results", response.data);
//       })
//       .catch((error) => {
//         console.log("Error on GET", error);
//       });
//   };
  
//   return (
//      <div className='SearchFetchEvents'>
//       <div>
//         <p>Search Events</p>
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button onClick={Search}>Search</button>
//         <p>{JSON.stringify(searchResults)}</p>
//       </div> 
//     </div>
//   );
//   }