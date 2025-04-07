import {useState, useEffect} from 'react';
import axios from 'axios';

function AlterAdminRoles( ) {
  
  useEffect(() => {
    fetchUsers();
  }, []);
  const [ usersList, setUsersList ]= useState([])

  const fetchUsers = () => {
    axios
      .get("/api/alterAdmin")
      .then((response) => {
        console.log(response.data);
        setUsersList(response.data);
      })
      .catch((err) => {
        console.log("error in AlterAdminRoles.get incoming", err);
      });
  };

  return (
     <div className='AlterAdminRoles'>
      <button onClick={fetchUsers}>fetch</button>
      <p>something{JSON.stringify(usersList)}</p>
    </div>
  );
  }

export default AlterAdminRoles;