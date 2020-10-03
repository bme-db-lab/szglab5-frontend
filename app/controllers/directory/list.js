import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    header: ['ID', 'Név', 'Felhasználónév', 'Neptun', 'E-mail'],
    rowIndecies: ['id', 'displayName', 'loginName', 'neptun', 'email'],

    showTable: false,
    showSettings: false,
    showNextPage: true,
    search: '',
    users: [],
    page: 0,

    loadUsers() {
      const pageSize = 50;
      this.get('store').query('user', {
        filter: {
          search: this.get('search')
        },
        offset: pageSize * this.get('page'),
        limit: pageSize
      }).then(users => {
        this.set('users', [
          ...this.get('users'),
          ...users.map(x => x)
        ]);
        this.set('showTable', true);
        this.set('showNextPage', users.content.length !== 0);
      });
    },

    actions: {
        openSettings(user) {
          this.transitionToRoute("directory.list.detail", user.get('id'));
          return false;
        },

        showTable() {
          this.set('page', 0);
          this.set('users', []);
          this.set('showTable', false);
          this.set('showNextPage', true);
          this.loadUsers();
          return false;
        },

        nextPage() {
          this.set('page', this.get('page') + 1);
          this.loadUsers();
          return false;
        },

        impersonateUser(user) {
          const errorMessage = error => {
            alert(error);
          };
          Ember.$.ajax({
            type: "POST",
            url: config.backendUrl + "/auth/impersonate",
            data: JSON.stringify({ userId: +user.get('id') }),
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
        }
    }
});
