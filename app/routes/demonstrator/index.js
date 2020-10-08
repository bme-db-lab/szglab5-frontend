import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../../mixins/error-route';
import DemonstratorAuthenticatedRouteMixin from '../../mixins/demonstrator-authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, DemonstratorAuthenticatedRouteMixin, {
});
