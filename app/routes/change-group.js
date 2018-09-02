import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import AdminAuthenticatedRouteMixin from '../mixins/admin-authenticated-route';
import ErrorRouteMixin from '../mixins/error-route';
import config from '../config/environment';

import DemonstratorAuthenticatedRouteMixin from '../mixins/demonstrator-authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin,  DemonstratorAuthenticatedRouteMixin, AdminAuthenticatedRouteMixin, ErrorRouteMixin, {
  model() {
    let eventTemplates =  Ember.$.ajax({
      type: "GET",
      url: `${config.backendUrl}/event-templates-simple`,
      beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Bearer ${this.get('session.data.authenticated.token')}`); },
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      dataType: "json",
      success: (eventTemplates) => {
        return eventTemplates;
      }
    });

    return RSVP.hash({
        studentGroups: this.get('store').findAll('studentGroup'),
        eventTemplates: eventTemplates
    });
  }
});
