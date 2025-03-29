import { useNavigate } from 'react-router-dom';

function EventUpdate({ event }) {
  const navigate = useNavigate();

  // Handle the edit action
  const handleEditEvent = () => {
    navigate("/updateEvent", { state: { event } });
  };

  return (
    <div>
      <h3>{event.title}</h3>
      <p>{event.date} - {event.location}</p>
      <button onClick={handleEditEvent}>Edit</button>
    </div>
  );
}

export default EventUpdate;
