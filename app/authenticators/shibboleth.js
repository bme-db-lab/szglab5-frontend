import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import config from '../config/environment';
import jwtDecode from 'npm:jwt-decode';

export default Base.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),

  _setupTokenExpiration(token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.exp) {
        const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
          setTimeout(() => {
            const session = this.get('session');
            if (session.isAuthenticated) {
              session.invalidate().then(() => {
                const router = Ember.getOwner(this).lookup('router:main');
                router.transitionTo('login');
              });
            }
          }, expiresIn * 1000);
        }
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  },

  authenticate() {
    return this.get('ajax').request(config['ember-simple-auth-token'].serverTokenShibbolethEndpoint).then((response) => {
      if (response && response.token) {
        this._setupTokenExpiration(response.token);
      }
      return response;
    });
  },

  restore(data) {
    const dataObject = Ember.Object.create(data);

    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!Ember.isEmpty(dataObject.get('token'))) {
        this.get('ajax').request(`${config.backendUrl}/auth/verify-token`, {
          method: 'POST',
          data: { token: dataObject.get('token') }
        }).then((response) => {
          this._setupTokenExpiration(dataObject.get('token'));
          resolve(data);
        }).catch(() => {
          reject();
        })
      } else {
        reject();
      }
    });
  }
});
