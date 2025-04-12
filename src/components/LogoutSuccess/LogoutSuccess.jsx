import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutSuccess() {
  const navigate = useNavigate();

  // Optional: Automatically navigate after a certain delay if you'd like
  useEffect(() => {
    setTimeout(() => {
      navigate('/'); // Redirect to homepage after 3 seconds or so
    }, 3000); // Adjust the time as needed
  }, [navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>You have been logged out successfully!</h2>
      <p>Thanks for stopping by. See you next time!</p>
    </div>
  );
}

export default LogoutSuccess;