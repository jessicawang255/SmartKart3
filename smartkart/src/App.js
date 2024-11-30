import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  // Destructure the required methods from useAuth0
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [recentEmail, setRecentEmail] = useState(null);

  useEffect(() => {
    const getGmailData = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: 'https://www.googleapis.com/gmail/v1/users/me',
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
          });

          const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (!response.ok) {
            throw new Error(`Error fetching messages: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            const messageId = data.messages[0].id;
            const messageResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });

            if (!messageResponse.ok) {
              throw new Error(`Error fetching message details: ${messageResponse.statusText}`);
            }

            const messageData = await messageResponse.json();
            setRecentEmail(messageData);
          }
        } catch (error) {
          console.error('Error fetching Gmail data:', error);
        }
      }
    };

    getGmailData();
  }, [getAccessTokenSilently, isAuthenticated]);

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
            <div>
              <h3>Your Most Recent Email:</h3>
              {recentEmail ? (
                <div>
                  <p><strong>Subject:</strong> {recentEmail.payload.headers.find(header => header.name === 'Subject')?.value || 'No Subject'}</p>
                  <p><strong>From:</strong> {recentEmail.payload.headers.find(header => header.name === 'From')?.value || 'Unknown Sender'}</p>
                  <p><strong>Snippet:</strong> {recentEmail.snippet}</p>
                </div>
              ) : (
                <p>No recent email found.</p>
              )}
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
