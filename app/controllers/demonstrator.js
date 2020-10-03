import Ember from 'ember';

export default Ember.Controller.extend({
  didReceiveAttrs: function() {
    this.set('selectedEvent', null);
    return this.set('currentView', null);
  },
  subMenu: Ember.computed('model.eventTemplates', 'model.eventTemplates.[]', function() {
    return this.get('model.eventTemplates').map(eventTemplate => ({
      key: eventTemplate,
      id: eventTemplate.get('id'),
      route: 'demonstrator.detail',
      description: eventTemplate.get('name')
    }));
  }),
  actions: {
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
