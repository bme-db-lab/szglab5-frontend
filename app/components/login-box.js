import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  username: '',
  password: '',
  error: '',
  hasError: false,
  redirect: null,
  session: Ember.inject.service('session'),
  currentUser: Ember.inject.service('session'),
  actions: {
    removeError() {
      this.set('hasError', false);
      this.set('errorShibboleth', '');
    },
    login() {
      var credentials = this.getProperties('username', 'password'), authenticator = config['ember-simple-auth'].authenticator;

      this.set('hasError', false);
      this.set('errorShibboleth', '');
      if (credentials.username.trim() === "" || credentials.password.trim() === "") {
        this.set('hasError', true);
        this.set('error', "Üres felhasználó/jelszó mező.");
        return false;
      }
      credentials.identification = credentials.username;
      credentials.username = undefined;
      this.get('session').authenticate(authenticator, credentials).then(() => {
        if (this.get('redirect') === null) {
          this.sendAction('goToSettings');
        }
        else {
          window.location.replace(`${this.get('redirect')}?token=${this.get('session.data.authenticated.token')}`);
        }
      }).catch((t) => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          this.set('error', t.errors[0].title);
          this.set('hasError', true);
        }
      });
      return false;
    },
    loginBMERedirect() {
      var currentWebsite = window.location.origin;
      var shibboleth = '/Shibboleth.sso/Login';
      var target = currentWebsite + '/#/login-shibboleth';

      if (this.get('redirect') !== null) {
        target += "?redirect="  + encodeURIComponent(this.get('redirect'));
       }

      var shibbolethUrl = currentWebsite + shibboleth + "?target=" + encodeURIComponent(target);

      window.location.replace(shibbolethUrl);
      return false;
    }
  }
});
