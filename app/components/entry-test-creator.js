import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  question: null,

  actions: {
    saveSettings() {
      this.get('question').save().then(() => {
        return this.sendAction('closeSettings');
      });
      return false;
    },
    closeSettings() {
      return this.sendAction('closeSettings');
    }
  },
  willDestroyElement() {
    this._super(...arguments);
    this.get('question').rollbackAttributes();
  }
});
