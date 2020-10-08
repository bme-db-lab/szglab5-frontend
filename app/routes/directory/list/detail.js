import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ErrorRouteMixin from '../../../mixins/error-route';
import AdminAuthenticatedRouteMixin from '../../../mixins/admin-authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, ErrorRouteMixin, AdminAuthenticatedRouteMixin, {
    renderTemplate() {
        this.render("directory.list.detail", {
          into: "directory"
        });
    },

    model(params) {
        return RSVP.hash({
            roles: this.get('store').findAll('role'),
            exerciseTypes: this.get('store').findAll('exerciseType'),
            semesters: this.get('store').findAll('semester'),
            user: this.get('store').findRecord('user', params.id)
        });
    }
});
