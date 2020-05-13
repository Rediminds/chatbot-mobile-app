import Auth0 from 'react-native-auth0';

const AUTH0_DOMAIN = 'dev-h9b2k98e.auth0.com';
const CLIENT_ID = 'YFPZz2aGcHuLEKGKt0VjCgOkoh1EGbTu';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: CLIENT_ID,
});

export {auth0, AUTH0_DOMAIN, CLIENT_ID};
