import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';


function Nav() {
  const user = useStore((store) => store.user);

  return (
    <nav>
      <ul>
        { // User is not logged in, render these links:
          !user.id && (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/registration">Register</NavLink>
              </li>
            </>
          )
        }
        { // User is logged in, render these links:
          user.id && (
            <>
              <li>
                <NavLink to="/">Event Home</NavLink>
              </li>
              <li>
                <NavLink to="/adminHome">Admin Home</NavLink>
              </li>
              <li>
                <NavLink to="/superAdminHome"> Super Admin Home</NavLink>
              </li>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              <li> 
                <NavLink to="/userAttended">User Homepage</NavLink>
              </li>
            </>
          )
        }
        {/* Show these links regardless of auth status: */}
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        {/* <li>
          <NavLink to="/events">Events</NavLink>
        </li> */}

      </ul>
    </nav>

  );
}


export default Nav;
