// src/App.js

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const [recentEmail, setRecentEmail] = useState(null);

  useEffect(() => {
    const getGmailData = async () => {
      if (isAuthenticated) {
        try {
          // Obtain the Google access token
          const namespace = 'https://smartkart.com/'; // Replace with your actual namespace
          const googleAccessToken = user[`${namespace}google_access_token`];

          if (!googleAccessToken) {
            throw new Error('Google access token not found.');
          }

          // Fetch the most recent email
          const response = await fetch(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1',
            {
              headers: {
                Authorization: `Bearer ${googleAccessToken}`,
              },
            }
          );

          if (response.status === 401) {
            throw new Error(
              'Unauthorized access. Please check your permissions.'
            );
          }

          if (!response.ok) {
            throw new Error(`Error fetching messages: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            const messageId = data.messages[0].id;
            const messageResponse = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
              {
                headers: {
                  Authorization: `Bearer ${googleAccessToken}`,
                },
              }
            );

            if (!messageResponse.ok) {
              throw new Error(
                `Error fetching message details: ${messageResponse.statusText}`
              );
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
  }, [isAuthenticated, user]);

  return (
    <div className="App">
      <header className="App-header">
        {/* Your existing code */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* If the user is not authenticated, show the login button */}
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        )}

        {/* If the user is authenticated, show the logout button */}
        {isAuthenticated && (
          <>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
            <div>
              <img src={user.picture} alt={user.name} />
              <h2>Welcome, {user.name}!</h2>
              <p>{user.email}</p>
            </div>
            <div>
              <h3>Your Most Recent Email:</h3>
              {recentEmail ? (
                <div>
                  <p>
                    <strong>Subject:</strong>{' '}
                    {recentEmail.payload.headers.find(
                      (header) => header.name === 'Subject'
                    )?.value || 'No Subject'}
                  </p>
                  <p>
                    <strong>From:</strong>{' '}
                    {recentEmail.payload.headers.find(
                      (header) => header.name === 'From'
                    )?.value || 'Unknown Sender'}
                  </p>
                  <p>
                    <strong>Snippet:</strong> {recentEmail.snippet}
                  </p>
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
