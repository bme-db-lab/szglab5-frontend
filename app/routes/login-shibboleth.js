import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import ErrorRouteMixin from '../mixins/error-route';

export default Ember.Route.extend(ErrorRouteMixin,  {
  session: Ember.inject.service('session'),
  beforeModel() {
    this._super(...arguments);

    var params = this.paramsFor('login-shibboleth');
    console.log(params);
    var session = this.get('session').authenticate('authenticator:shibboleth').then(()=>{
      if (this.get('redirect') === null) {
        this.sendAction('goToSettings');
      }
      else {
        window.location.replace(`${decodeURIComponent(params.get('redirect'))}&token=${this.get('session.data.authenticated.token')}`);
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
