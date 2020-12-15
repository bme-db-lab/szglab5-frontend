import Ember from 'ember';

export default Ember.Controller.extend({
  subMenu: Ember.computed('model', 'model.[]', function() {
    let subMenu = this.get('model').map(eventTemplate => ({
      id: eventTemplate.get('id'),
      route: 'demonstrator.detail',
      description: eventTemplate.get('name')
    }));
    return subMenu.sort((lhs, rhs) => {
      return lhs.description - rhs.description;
    });
  })
});
