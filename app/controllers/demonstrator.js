import Ember from 'ember';

export default Ember.Controller.extend({
  subMenu: Ember.computed('model', 'model.[]', function() {
    return this.get('model').map(eventTemplate => ({
      id: eventTemplate.get('id'),
      route: 'demonstrator.detail',
      description: eventTemplate.get('name')
    }));
  })
});
