
import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import '../LoginPage/LoginPage.css'


function LoginPage() {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const logIn = useStore((state) => state.logIn)
 const errorMessage = useStore((state) => state.authErrorMessage);
 const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);


 useEffect(() => {
   // Clear the auth error message when the component unmounts:
   return () => {
     setAuthErrorMessage('');
   }
 }, [])


 const handleLogIn = (event) => {
   event.preventDefault();


   logIn({
     username: username,
     password: password,
   })
 };


 return (
   <div className='login-page'>
     <div className='left-section'>
       <img
         className='left-image'
         src="images/front-view-stacked-books-diploma-earth-globe-with-copy-space-education-day (1).jpg"
         alt="Books and Globe"
       />
     </div>
     <div className='right-section'>
       <img
         className='right-image'
         src="images/LMRHorizontal-1.png"
         alt="Logo"
       />
       <form onSubmit={handleLogIn} className='login-form'>
         <h2>Log in</h2>
         <p>Please enter your username and password credentials.</p>
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
         <button type="submit">
           Log In
         </button>
       </form>
       {errorMessage && (
         <h3 className='error-message'>
           {errorMessage}
         </h3>
       )}
     </div>
   </div>
 );
}


export default LoginPage;

