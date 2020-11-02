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
          isCorrector: true,
          isFile: true,
          finalized: false
        }
      }),
      eventTemplates: this.get('store').query('eventTemplate', {
        filter: {
          asCorrector: true
        }
      })
    });
  },
  actions: {
    refreshDeliverables: function() {
      this.refresh();
    }
  }
});
