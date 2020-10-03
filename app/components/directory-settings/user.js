import Ember from 'ember';

export default Ember.Component.extend({
  checkRoles: false,
  isEvaluator: Ember.computed('checkRoles', function () {
    return this.get('user.Roles').filter(x => x.get('name') === 'CORRECTOR').length !== 0;
  }),
  isStudent: Ember.computed('checkRoles', function () {
    return this.get('user.Roles').filter(x => x.get('name') === 'STUDENT').length !== 0;
  }),
  currentRoles: Ember.computed('user.Roles', 'user.Roles.[]', 'user.Roles.@each', function () {
    return this.get('user.Roles').map(x => x.get('name'));
  }),
  init() {
    this._super(...arguments);
    this.set('newEmail', this.get('user.email'));
  },
  successfullPwd: false,
  successfullEmail: false,
  actions: {
    setNewPwd() {
      this.set('successfullPwd', false);
      this.get('user').set('newpwd', this.get('newPwd'));
      this.get('user').save().then(() => {
        this.set('successfullPwd', true);
        this.set('newPwd', undefined);
        this.get('user').set('newpwd', undefined);
      });
      return false;
    },
    setNewEmail() {
      this.set('successfullEmail', false);
      this.get('user').set('email', this.get('newEmail'));
      this.get('user').save().then(() => {
        this.set('successfullEmail', true);
        this.set('newEmail', undefined);
      });
      return false;
    },
    closeSettings() {
      return this.sendAction('closeSettings');
    },
    impersonateUser() {
      return this.sendAction('impersonateUser');
    },
    toggleRole(role) {
      const roles = this.get('user.Roles');
      if (roles.indexOf(role) === -1) {
        roles.pushObject(role);
      }
      else {
        roles.removeObject(role);
      }
      return false;
    },
    saveRoles() {
      this.set('successfullRoles', false);
      this.get('user').save().then(() => {
        this.set('successfullRoles', true);
        this.toggleProperty('checkRoles');
      });
      return false;
    }
  },
  willDestroyElement() {
    this._super(...arguments);
    this.get('user').rollbackAttributes();
  }
});
