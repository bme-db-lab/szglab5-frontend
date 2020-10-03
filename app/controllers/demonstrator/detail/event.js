import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  classNames: ['evaluation-student'],

  actions: {
    toggleFinalized(obj) {
      obj.toggleProperty('finalized');
      return false;
    },

    save() {
      if (this.get('model.comment') === '') {
        this.set('model.comment', null);
      }
      if (this.get('model.grade') === '') {
        this.set('model.grade', null);
      }
      if (this.get('model.firstEntryTest.grade') === '') {
        this.set('model.firstEntryTest.grade', null);
      }
      if (this.get('model.imsc') === '') {
        this.set('model.imsc', 0);
      }

      // TODO: Show messagebox
      const errorHandler = t => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          this.set('error', t.errors[0].title);
        }
      };

      this.set('success', false);
      this.set('error', '');
      this.get('model.firstEntryTest').save().then(() => {
        this.get('model').save().then(() => {
          this.set('success', true);
          this.sendAction('cancel'); // go back to the settings of all the students in the group
        }, err => errorHandler(err));
      }, err => errorHandler(err));
      return false;
    },

    cancel() {
      this.get('model').rollbackAttributes();
      return this.sendAction('cancel');
    },

    download(downloadLink) {
      const form = document.createElement('form');
      form.setAttribute('target', '_blank');
      form.setAttribute('method', 'post');
      form.setAttribute('action', downloadLink);
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'token');
      hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
      form.appendChild(hiddenInput);
      document.body.appendChild(form);
      form.submit();
      form.remove();
      return false;
    }
  }
});
