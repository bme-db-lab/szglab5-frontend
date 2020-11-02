import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../../mixins/error-route';
import CorrectorAuthenticatedRouteMixin from '../../mixins/corrector-authenticated-route';
import RSVP from 'rsvp';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, CorrectorAuthenticatedRouteMixin, {
  model() {
    return RSVP.hash({
      deliverables: this.get('store').query('deliverable', {
        filter: {
          isFree: true,
          isAttached: true,
          isOver: true,
          isFile: true,
          isUploaded: true
        }
      }),
      eventTemplates: this.get('store').query('eventTemplate', {
        filter: {
          asCorrector: true
        }
      })
    });
  }
});
