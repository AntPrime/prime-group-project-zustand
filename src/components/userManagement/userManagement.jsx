//This fetches a list of users from an admin-only endpoint, like...
// GET /api/user/admin), displays them, and offers a simple local search


import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';

function UserManagement() {
  const user = useStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = () => {
    axios
      .get('/api/user/admin', { withCredentials: true }) // admin-only route
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    // For a real app, we might do server-side search:
    // axios.get(`/api/user/admin?search=${searchTerm}`)
    // Or we may filter client-side:
    if (searchTerm.trim() === '') {
      fetchUsers();
    } else {
      const filtered = users.filter((u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} — Role: {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;


// Make sure back-end has a route like GET /api/user/admin that returns all users.

// I can add more features like “Change Password,” “Delete Account”...
// by calling additional endpoints like ( DELETE /api/user/admin/:id or PUT /api/user/admin/:id).
// If needed adjust the URL accordingly.