/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'szglab5-frontend',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    backendUrl: 'http://localhost:7000',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };
  try {
    ENV = (require('./' + environment))(ENV);
  }
  catch(err){
  }
  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:token',
    authenticator: 'authenticator:jwt',
    baseURL: ENV.rootURL,
    routeIfAlreadyAuthenticated: 'settings',
    authenticationRoute: 'login',
    routeAfterAuthentication: 'settings'
  };
  ENV['ember-simple-auth-token'] = {
    serverTokenEndpoint: ENV.backendUrl + '/auth/login',
    serverTokenShibbolethEndpoint: ENV.backendUrl + '/auth/loginshibboleth',
    identificationField: 'loginName',
    passwordField: 'password',
    tokenPropertyName: 'token',
    refreshTokenPropertyName: 'refresh_token',
    authorizationPrefix: 'Bearer ',
    authorizationHeaderName: 'Authorization',
    headers: {},
    refreshAccessTokens: true,
    serverTokenRefreshEndpoint: ENV.backendUrl + '/auth/login', //TODO: refresh Url
    tokenExpireName: 'exp',
    refreshLeeway: 300 // Refresh the token 5 minutes (300s) before it expires.
  };

  return ENV;
};
