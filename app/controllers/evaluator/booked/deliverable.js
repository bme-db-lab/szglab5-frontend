import Ember from 'ember';

export default Ember.Controller.extend({
    deliverable: Ember.computed.alias("model.deliverable"),

    event: Ember.computed.alias("deliverable.Event"),
    student: Ember.computed.alias("event.StudentRegistration.User"),
    demonstrator: Ember.computed.alias("event.Demonstrator"),

    session: Ember.inject.service('session'),

    actions: {
        download() {
            const form = document.createElement('form');
            form.setAttribute('target', '_blank');
            form.setAttribute('method', 'post');
            form.setAttribute('action', this.get('deliverable.downloadLink'));
            const hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'token');
            hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
            form.appendChild(hiddenInput);
            document.body.appendChild(form);
            form.submit();
            form.remove();
            return false;
        },

        save(finalized = true) {
            this.set('success', false);
            this.set('error', '');
            if (this.get('deliverable.comment') === '') {
              this.set('deliverable.comment', null);
            }
            if (this.get('deliverable.grade') === '') {
              this.set('deliverable.grade', null);
            }
            if (this.get('deliverable.imsc') === '') {
              this.set('deliverable.imsc', null);
            }
            if (this.get('deliverable.grade') === null) {
              if (finalized) {
                this.set('error', 'No grade provided.');
                return;
              }
            }
            if (this.get('deliverable.comment') === null) {
              if (finalized) {
                this.set('error', 'No comment provided.');
                return;
              }
            }
            this.set('deliverable.finalized', finalized);
            this.get('deliverable').save().then(() => {
              this.set('success', true);
              this.send('refreshDeliverables');
            }, (t) => {
              if (t.errors && t.errors.length > 0 && t.errors[0].title) {
                this.set('error', t.errors[0].title);
              }
            });
          },

        unbook() {
            this.set('success', false);
            this.set('error', '');
            this.set('deliverable.Corrector', null);
            this.set('deliverable.grading', false);
            this.get('deliverable').save().then(() => {
              this.set('success', true);
              this.send('refreshDeliverables');
              this.transitionToRoute("evaluator.booked.no-deliverable");
              return false;
            }, (t) => {
              if (t.errors && t.errors.length > 0 && t.errors[0].title) {
                this.set('error', t.errors[0].title);
              }
            });
          }
    }
});
