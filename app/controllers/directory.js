import Ember from 'ember';

export default Ember.Controller.extend({
  subMenu: [
    {
      route: 'directory.list',
      description: 'Felhasználók listázása'
    },
    {
      route: 'directory.new',
      description: 'Új felhasználó'
    }
  ]
});
