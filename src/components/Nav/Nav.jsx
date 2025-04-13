import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate here
import useStore from '../../zustand/store';
import '../Nav/Nav.css';


function Nav() {
 const user = useStore((store) => store.user);
 const logOut = useStore((state) => state.logOut);
 const navigate = useNavigate(); // Initialize useNavigate hook


 // Logout handler that logs out the user and redirects to the LogoutSuccess page
 const handleLogout = async () => {
   await logOut();
   navigate('/logout-success'); // Navigate to logout success page
 };

 // Navigate based on the user role
 const handleRedirect = () => {
  if (user.admin_level === 1) {
    navigate('/adminHome'); // Redirect to Admin Home
  } else if (user.admin_level === 2) {
    navigate('/superAdminHome'); // Redirect to Super Admin Home
  } else {
    navigate('/userHome'); // Redirect to User Home
  }
};

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
             {user.admin_level === 0 && (
               <>
                <li>
                   <NavLink to="/Homepage">Homepage</NavLink>
                 </li>
                 <li>
                   <NavLink to="/">Events</NavLink>
                 </li>
                 <li>
                   <NavLink to="/userAttended">Account</NavLink>
                 </li>
               </>
             )}
             {user.admin_level === 1 && (
               <>
                 <li>
                   <NavLink to="/adminHome">Admin Home</NavLink>
                 </li>
               </>
             )}
             {user.admin_level === 2 && (
               <>
                 <li>
                   <NavLink to="/superAdminHome">Super Admin Home</NavLink>
                 </li>
               </>
             )}
           </>
         )}
         <li>
           <NavLink to="/about">About</NavLink>
         </li>


         {/* Show the logout button if the user is logged in */}
         {user.id && (
           <li onClick={handleLogout} className="nav-link logout-link">
           Logout
         </li>
         )}
       </ul>
     </div>
   </nav>
 );
}


export default Nav;



