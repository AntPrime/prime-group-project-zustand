import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import '../RegisterPage/RegisterPage.css';


function RegisterPage() {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const register = useStore((state) => state.register);
 const errorMessage = useStore((state) => state.authErrorMessage);
 const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);


 useEffect(() => {
   // Clear the auth error message when the component unmounts:
   return () => {
     setAuthErrorMessage('');
   };
 }, [setAuthErrorMessage]);


 const handleRegister = (event) => {
   event.preventDefault();


   register({
     username: username,
     password: password,
   });
 };


 return (
   <div className="register-page">
     <div className="left-section">
       <img
         className="left-image"
         src="images/front-view-stacked-books-diploma-earth-globe-with-copy-space-education-day (1).jpg"
         alt="Books and Globe"
       />
     </div>
     <div className="right-section">
       <img
         className="right-image"
         src="images/LMRHorizontal-1.png"
         alt="Logo"
       />
       <form onSubmit={handleRegister} className="register-form">
         <h2>Register</h2>
         <p>Please enter a username and password to create your account.</p>
         <label htmlFor="username">Username:</label>
         <input
           type="text"
           id="username"
           required
           value={username}
           onChange={(e) => setUsername(e.target.value)}
         />
         <label htmlFor="password">Password:</label>
         <input
           type="password"
           id="password"
           required
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
         <button type="submit">Register</button>
       </form>
       {errorMessage && <h3 className="error-message">{errorMessage}</h3>}
     </div>
   </div>
 );
}


export default RegisterPage;


