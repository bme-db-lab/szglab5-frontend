import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set('new', false);
    if (!(this.get('notification'))) {
      this.set('notification', this.get('store').createRecord('news', {
        admins: false,
        students: false,
        demonstators: false,
        evaluators: false,
        onLogin: false,
      }));
      this.set('new', true);
    }
  },

  actions: {
    toggleAdmins: function () {
      this.toggleProperty('notification.admins');
      return false;
    },

    toggleStudents: function () {
      this.toggleProperty('notification.students');
      return false;
    },

    toggleDemonstrators: function () {
      this.toggleProperty('notification.demonstators');
      return false;
    },

    toggleEvaluators: function () {
      this.toggleProperty('notification.evaluators');
      return false;
    },

    toggleLogin: function () {
      this.toggleProperty('notification.onLogin');
      return false;
    },

    saveSettings() {
      this.get('notification').save().then(() => {
        if (this.get('goToView')) {
          return this.sendAction('goToView', 'list');
        }
        else {
          return this.sendAction('closeSettings');
        }
      });
      return false;
    },

    closeSettings: function () {
      return this.sendAction('closeSettings');
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('notification').rollbackAttributes();
  }
});
