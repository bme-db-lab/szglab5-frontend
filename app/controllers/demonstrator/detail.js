import Ember from 'ember';

export default Ember.Controller.extend({
  didReceiveAttrs: function() {
    this.set('selectedEvent', null);
    return this.set('currentView', null);
  },
  actions: {
    goToView: function(key) {
      this.set('selectedEvent', null);
      this.set('currentView', key);
      return false;
    },
    cancel: function() {
      this.set('selectedEvent', null);
      return false;
    },
    evaluateEvent: function(event) {
      this.set('selectedEvent', event);
      return false;
    }
  }
});
