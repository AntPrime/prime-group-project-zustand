import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import '../RegisterPage/RegisterPage.css'

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const register = useStore((state) => state.register)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [setAuthErrorMessage])

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      username: username,
      password: password,
    })
  };

 
  

  return (
    <div className='register-page'>
      <h2>Register Page</h2>
      <form onSubmit={handleRegister}>
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
          Register 
        </button>
      </form>
      { // Conditionally render registration error:
        errorMessage && (
          <h3 className='error-message'>{errorMessage}</h3>
        )
      }
    </div>
  );
}


export default RegisterPage;
