import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import config from '../config/environment';

export default Base.extend({
  ajax: Ember.inject.service(),

  authenticate() {
    return this.get('ajax').request(config['ember-simple-auth-token'].serverTokenShibbolethEndpoint);
  }
});
