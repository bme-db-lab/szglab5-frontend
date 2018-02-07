import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['redirect', 'errorMessage'],
  redirect: null,
  errorMessage: "",
  session: Ember.inject.service('session'),
  redirectChanged: Ember.computed('redirect', function () {
    if (this.get('session').get('isAuthenticated')) {
      if (this.get('redirect') === null) {
        this.actions.goToSettings.apply(this);
      }
      else {
        window.location.replace(`${this.get('redirect')}?token=${this.get('session.data.authenticated.token')}`);
      }
    }
  }),
  actions: {
    goToSettings() {
      this.transitionToRoute('settings');
      return false;
    }
  }
});
