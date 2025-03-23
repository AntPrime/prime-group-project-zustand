// We may need to define routes in...
// App.jsx for "/admin", "/admin/users", and "/admin/events".
// I assume we will store the user’s role in user.role.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';


function Dashboard() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  // If user is not admin, redirect to home
  useEffect(() => {
    if (!user.id || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
     <div style={{ display: 'flex' }}>
  {/* Sidebar */}
<aside style={{ width: '200px', backgroundColor: '#eee', padding: '1rem' }}>

 <h2>Admin Dashboard</h2>

<ul style={{ listStyle: 'none', paddingLeft: 0 }}>

  <li>
 <button onClick={() => navigate('/admin/users')}>User Management</button>
  </li>

 <li>
<button onClick={() => navigate('/admin/events')}>Event Management</button>
 </li>
</ul>
</aside>

 {/* Main content */}
<main style={{ flex: 1, padding: '1rem' }}>

<h1>Welcome, Admin {user.username}</h1>

 <p>Use the sidebar to manage users and events.</p>

 </main>
    </div>
  );
}

export default Dashboard;
