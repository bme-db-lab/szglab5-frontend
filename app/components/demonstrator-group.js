import Ember from 'ember';
import RSVP from 'rsvp';
import config from '../config/environment';
import { dateformat } from '../helpers/dateformat';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  sortedEventsByCourseCode: Ember.computed('currentEventTemplate', function () {
    return new RSVP.Promise((resolve, reject) => {
      if (this.get('currentEventTemplate.id')) {
        this.get('store').query('event', {
          filter: {
            eventTemplateId: this.get('currentEventTemplate.id')
          }
        }).then(events => {
          let sortedEventsByCourseCode = {}
          events = events
            .map(event => {
              event.set('formattedDate', dateformat([event.get('date')]));

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
    form.setAttribute('action', `${config.backendUrl}/event-templates/${this.get('currentEventTemplate.id')}/listDownload.zip`);
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
    evaluateEvent(event) {
      return this.sendAction('evaluateEvent', event);
    },
    generateSheetSupplementary() {
      return this.download.apply(this, [true]);
    },
    generateSheet() {
      return this.download.apply(this);
    }
  }
});
