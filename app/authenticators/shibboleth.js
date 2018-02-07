import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import config from '../config/environment';

export default Base.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service('session'),

  authenticate() {
    var url = config['ember-simple-auth-token'].serverTokenShibbolethEndpoint;
    return this.get('ajax').request(url, {
      type: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/vnd.api+json'
      }
    }).then((response) => {
      console.log(response);
    }).catch(function(error){
        console.log(error);
        this.transitionTo('login', { queryParams: { errorMessage: error['errors']['title'] }});
    });
  }
});
