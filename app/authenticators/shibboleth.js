import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import config from '../config/environment';
import RSVP from 'rsvp';

export default Base.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service('session'),

  authenticate() {
    return new RSVP.Promise(function(resolve, reject){
      return this.get('ajax').request(config['ember-simple-auth-token'].serverTokenShibbolethEndpoint, {
        type: 'GET',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      });
    });
  }
});
