import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../../mixins/error-route';
import AdminAuthenticatedRouteMixin from '../../mixins/admin-authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, AdminAuthenticatedRouteMixin, {
    queryParams: {
      search: {
        refreshModel: false
      }
    },

    actions: {
      didTransition() {
        this.controllerFor('directory.list').initSearch();
        return true; // Bubble the didTransition event
      }
    }
});
