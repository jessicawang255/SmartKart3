import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';


function App() {
  // Destructure the required methods from useAuth0
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        
        {/* If the user is not authenticated, show the login button */}
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        )}

        {/* If the user is authenticated, show the logout button */}
        {isAuthenticated && (
          <>
            <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
            <div>
              <img src={user.picture} alt={user.name} />
              <h2>Welcome, {user.name}!</h2>
              <p>{user.email}</p>
            </div>
          </>
        )}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
