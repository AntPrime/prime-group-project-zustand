import axios from "axios";
import { useState } from "react";

function EventsPage() {
  const [event, setEvent] = useState({ title: "", school_id: 0, location: "", notes: "" });

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

  //POST to create a new event //?haven't finished adding all fields to create a new event
  const createEvent = () => {
    console.log("sending event", event);
    axios
      .post("/api/events", event)
      .then((response) => {
        alert("event sent");
        setEvent({ title: "", school_id: 0, location: "", notes: "" });
      })
      .catch((err) => {
        console.log("error in event post", err);
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
          <input
          type="text"
          placeholder="title"
          onChange={(e) =>
            setEvent({
              ...event,
              title: e.target.value,
            })
          }
        />
             <input
          type="text"
          placeholder="notes"
          onChange={(e) =>
            setEvent({
              ...event,
              notes: e.target.value,
            })
          }
        />

        {/* a drop down in this format might not be scalable for client to add new schools*/}
      <select className="tennis-green" onChange={(e)=>{setEvent({ ...event, school_id: e.target.value})}} >
        <option value=''>School</option>
        <option value="1">Elk River</option>
        <option value="2" >Rogers</option>
        <option value="3">Zimmerman</option>
      </select>
        <button type="submit">add event</button>
      </form>
    </div>
  );
}

export default EventsPage;
