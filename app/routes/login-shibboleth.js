import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import ErrorRouteMixin from '../mixins/error-route';

export default Ember.Route.extend(ErrorRouteMixin,  {
  session: Ember.inject.service('session'),
  beforeModel() {
    this._super(...arguments);
    var session = this.get('session').authenticate('authenticator:shibboleth').catch((e) => {
        this.transitionTo('login', { queryParams: { errorMessage: "Shibboleth error: " + e['errors'][0]['title'] }});
    });
  }
});
