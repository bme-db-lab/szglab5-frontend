import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../../mixins/error-route';
import CorrectorAuthenticatedRouteMixin from '../../mixins/corrector-authenticated-route';
import jwt_decode from 'npm:jwt-decode';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, CorrectorAuthenticatedRouteMixin, {
  model() {
    var token = this.get('session.data.authenticated.token');
    var userData = jwt_decode(token);
    return RSVP.hash({
      user: this.get('store').find('user', userData.userId),
      eventTemplates: this.get('store').query('eventTemplate', {
        filter: {
          asCorrector: true
        }
      })
    });
  }
});
