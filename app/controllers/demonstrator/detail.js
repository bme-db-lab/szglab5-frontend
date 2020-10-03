import Ember from 'ember';
import RSVP from 'rsvp';
import config from '../../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  // TODO: move to models/eventTemplate.js when the Events attribute is filtered in the get call.
  sortedEventsByCourseCode: Ember.computed('model', function () {
    return new RSVP.Promise((resolve, reject) => {
      if (this.get('model.id')) {
        this.get('store').query('event', {
          filter: {
            eventTemplateId: this.get('model.id')
          }
        }).then(events => {
          let sortedEventsByCourseCode = {}
          events.map(event => {
            const courseCode = event.get('CourseCode');
            if(!Object.keys(sortedEventsByCourseCode).includes(courseCode)) {
              sortedEventsByCourseCode[courseCode] = []
            }
            sortedEventsByCourseCode[courseCode].push(event)
            return event;
          });

          resolve(sortedEventsByCourseCode);
        }, err => {
          console.error(err);
          reject(err);
        });
      }
      else {
        resolve({});
      }
    });
  }),

  download(supplementary) {
    const form = document.createElement('form');
    form.setAttribute('target', '_blank');
    form.setAttribute('method', 'post');
    form.setAttribute('action', `${config.backendUrl}/event-templates/${this.get('model.id')}/listDownload.zip`);
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'token');
    hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
    form.appendChild(hiddenInput);
    hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'supplementary');
    hiddenInput.setAttribute('value', supplementary || false);
    form.appendChild(hiddenInput);
    document.body.appendChild(form);
    form.submit();
    form.remove();
    return false;
  },

  actions: {
    evaluateEvent: function(event) {
      this.transitionToRoute("demonstrator.detail.event", event.get('id'));
      return false;
    },

    generateSheetSupplementary() {
      return this.download.apply(this, [true]);
    },

    generateSheet() {
      return this.download.apply(this);
    }
  }
});
