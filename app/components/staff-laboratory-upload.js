import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['file-upload'],
  session: Ember.inject.service('session'),

  error: '',
  success: false,

  actions: {
    uploadStarted() {
      this.set('success', false);
      this.set('error', '');
      return false;
    },

    uploadSuccess() {
      this.set('success', true);
      this.get('Deliverable').reload();
      return false;
    },

    uploadFailed(data) {
      if (data && data.body && data.body.errors && data.body.errors[0]) {
        this.set('error', data.errors[0]);
      }
      else {
        this.set('error', 'Unknown error.');
      }
      return false;
    },

    download() {
      const form = document.createElement('form');
      form.setAttribute('target', '_blank');
      form.setAttribute('method', 'post');
      form.setAttribute('action', this.get('Deliverable.downloadLink'));
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'token');
      hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
      form.appendChild(hiddenInput);
      document.body.appendChild(form);
      form.submit();
      form.remove();
    }
  }
});
