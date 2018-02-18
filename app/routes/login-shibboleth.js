import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import ErrorRouteMixin from '../mixins/error-route';

export default Ember.Route.extend(ErrorRouteMixin,  {
  session: Ember.inject.service('session'),
  beforeModel() {
    this._super(...arguments);

    var redirect = this.paramsFor('login-shibboleth')['redirect'];
    var session = this.get('session').authenticate('authenticator:shibboleth').then(()=>{
      if (redirect === null) {
        this.sendAction('goToSettings');
      }
      else {
        var url = `${redirect}?token=${this.get('session.data.authenticated.token')}`;
        window.location.replace(url);
      }
    }).catch((e) => {
        if ((e['errors'] !== undefined) && (e['errors'].length > 0) && (e['errors'][0]['title'] !== undefined)) {
          this.transitionTo('login', { queryParams: { errorMessage: "Shibboleth login error: " + e['errors'][0]['title'] }});
        }
        else {
          this.transitionTo('login', { queryParams: { errorMessage: "Shibboleth login error"}});
        }
    });
  }
});
