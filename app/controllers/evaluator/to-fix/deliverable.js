import Ember from 'ember';

export default Ember.Controller.extend({
    deliverable: Ember.computed.alias("model.deliverable"),

    event: Ember.computed.alias("deliverable.Event"),
    student: Ember.computed.alias("event.StudentRegistration.User"),
    eventDemonstrator: Ember.computed.alias("event.Demonstrator"),
    eventTemplate: Ember.computed.alias("event.EventTemplate"),
    exerciseCategory: Ember.computed.alias("eventTemplate.ExerciseCategory"),

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

        book() {
            this.set('success', false);
            this.set('error', '');
            this.set('deliverable.Corrector', this.get('model.user'));
            this.set('deliverable.grading', true);
            this.get('deliverable').save().then(() => {
              this.set('success', true);
              this.send('refreshDeliverables');
            }, (t) => {
              if (t.errors && t.errors.length > 0 && t.errors[0].title) {
                this.set('error', t.errors[0].title);
              }
            });
          }
    }
});
