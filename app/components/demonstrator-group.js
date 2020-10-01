import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],
  actions: {
    evaluateEvent(event) {
      return this.sendAction('evaluateEvent', event);
    }
  }
});
