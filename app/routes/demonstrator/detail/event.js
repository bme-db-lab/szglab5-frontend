import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../../../mixins/error-route';
import DemonstratorAuthenticatedRouteMixin from '../../../mixins/demonstrator-authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, DemonstratorAuthenticatedRouteMixin, {
  renderTemplate() {
    this.render("demonstrator.detail.event", {
      into: "demonstrator"
    });
  },

  model(params) {
    return this.get('store').findRecord('event', params.id);
  }
});
