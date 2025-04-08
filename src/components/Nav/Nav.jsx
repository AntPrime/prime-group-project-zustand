import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import '../Nav/Nav.css';

function Nav() {
  const user = useStore((store) => store.user);

  return (
    <nav className="nav-container">
      <div className="nav-image-container">
        <img src="images/LMRHorizontal-1.png" alt="Logo" className="nav-image" />
      </div>

      <div className="nav-right">
        <ul className="nav-links">
          {!user.id && (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/registration">Register</NavLink>
              </li>
            </>
          )}
          {user.id && (
            <>
              <li>
                <NavLink to="/">Event Home</NavLink>
              </li>
              <li>
                <NavLink to="/userAttended">User Homepage</NavLink>
              </li>
              {user.admin_level >= 1 && (
                <>
                  <li>
                    <NavLink to="/adminHome">Admin Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/events">Events</NavLink>
                  </li>
                </>
              )}
              {user.admin_level >= 2 && (
                <>
                  <li>
                    <NavLink to="/superAdminHome">Super Admin Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/alterAdmin">Alter Admin</NavLink>
                  </li>
                </>
              )}
            </>
          )}
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;


