import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    goToView: function(key) {
      return this.sendAction('goToView', key);
    }
  }
});
