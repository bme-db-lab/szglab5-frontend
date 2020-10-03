import Ember from 'ember';

export default Ember.Controller.extend({
  didReceiveAttrs: function() {
    this.set('selectedEvent', null);
    return this.set('currentView', null);
  },
  subMenu: Ember.computed('model.eventTemplates', 'model.eventTemplates.[]', function() {
    return this.get('model.eventTemplates').map(eventTemplate => ({
      key: eventTemplate,
      description: eventTemplate.get('name')
    }));
  }),
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
