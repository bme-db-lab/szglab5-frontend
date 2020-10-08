import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../mixins/error-route';
import CorrectorAuthenticatedRouteMixin from '../mixins/corrector-authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, CorrectorAuthenticatedRouteMixin, {
});
