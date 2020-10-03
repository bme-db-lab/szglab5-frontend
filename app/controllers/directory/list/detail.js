import Ember from 'ember';
import config from '../../../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  checkRoles: false,
  user: Ember.computed.alias('model.user'),

  isEvaluator: Ember.computed('checkRoles', function () {
    return this.get('user.Roles').filter(x => x.get('name') === 'CORRECTOR').length !== 0;
  }),

  isStudent: Ember.computed('checkRoles', function () {
    return this.get('user.Roles').filter(x => x.get('name') === 'STUDENT').length !== 0;
  }),

  currentRoles: Ember.computed('user.Roles', 'user.Roles.[]', 'user.Roles.@each', function () {
    return this.get('user.Roles').map(x => x.get('name'));
  }),

  newEmail: Ember.computed.oneWay('user.email'),

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

    impersonateUser() {
        const errorMessage = error => {
          alert(error);
        };
        Ember.$.ajax({
          type: "POST",
          url: config.backendUrl + "/auth/impersonate",
          data: JSON.stringify({ userId: +this.get('user.id') }),
          beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Bearer ${this.get('session.data.authenticated.token')}`); },
          contentType: "application/json; charset=utf-8",
          crossDomain: true,
          dataType: "json",
          success: (data) => {
            if (data.token) {
              this.set('session.data.authenticated.token', data.token);
              this.get('session').trigger('authenticationSucceeded');
              this.transitionToRoute('settings');
            }
          },
          failure: errorMessage,
          statusCode: {
            500: errorMessage,
            404: errorMessage,
            403: errorMessage,
          }
        });
        return false;
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

});
