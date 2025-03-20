import axios from "axios";
import { useState } from "react";

function EventsPage() {
  const [event, setEvent] = useState({ location: "" });

  //added for search feature-g
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const createEvent = () => {
    console.log("sending event", event);
    axios
      .post("/api/events", event)
      .then((response) => {
        alert("event sent");
        setEvent({ location: "" });
      })
      .catch((err) => {
        console.log("error in event post", err);
      });
  };

  //Search function for get requests-g
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
    <div className="EventsPage">

      {/* g */}
      <input type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={(e)=> setSearchQuery(e.target.value)}/>
      <button onClick={ Search }>Search</button>
      <p>{JSON.stringify(searchResults)}</p>
       {/* g */}

      <p>Add event</p>
      <form
        onSubmit={(e) => {
          createEvent(event);
        }}
      >
        <input
          type="text"
          placeholder="new location"
          onChange={(e) =>
            setEvent({
              ...event,
              location: e.target.value,
            })
          }
        />
        <button type="submit">add location</button>
      </form>
    </div>
  );
}

export default EventsPage;
