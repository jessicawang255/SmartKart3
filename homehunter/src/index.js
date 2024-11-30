import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

ReactDOM.render(
  <Auth0Provider
    domain="dev-1fs2goy00nq3oasa.us.auth0.com"
    clientId="xww2NrjfrhRk8mQTnaFnI922EX2jO0Ms"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
