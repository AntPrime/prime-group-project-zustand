
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import UserManagement from '../UserManagement/UserManagement';
import EventManagement from '../EventManagement/EventManagement';

function AdminDashboard() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users'); // default to User Management

  // Redirect non-admins away from admin dashboard.
  useEffect(() => {
    if (!user.id || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Admin Toolbar Sidebar */}
      <aside
        style={{
          width: '220px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '1rem',
        }}
      >
        <h2>Admin Toolbar</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                backgroundColor: activeTab === 'users' ? '#555' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                width: '100%',
                textAlign: 'left',
              }}
            >
              User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                backgroundColor: activeTab === 'events' ? '#555' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                width: '100%',
                textAlign: 'left',
              }}
            >
              Event Management
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1rem' }}>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'events' && <EventManagement />}
      </main>
    </div>
  );
}

export default AdminDashboard;
