import Ember from 'ember';
import RSVP from 'rsvp';
import config from '../../config/environment';
import moment from 'moment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  noGroupToShow: false,

  // TODO: move to models/eventTemplate.js when the Events attribute is filtered in the get call.
  sortedEventsByCourseCode: Ember.computed('model', function () {
    this.set("noGroupToShow", false);
    return new RSVP.Promise((resolve, reject) => {
      if (this.get('model.id')) {
        this.get('store').query('event', {
          filter: {
            eventTemplateId: this.get('model.id')
          }
        }).then(events => {
          let separatedEventsByCourseCode = {};
          let eventDateByCourseCode = [];

          events.map(event => {
            let attempt =  event.get('attempt');
            let date =  event.get('date');
            let dateString = moment(date).format("YYYY. MM. DD. hh:mm");

            const courseCode = attempt > 1 ? "Pótlás" : event.get('CourseCode');
            if(!Object.keys(separatedEventsByCourseCode).includes(courseCode)) {
              separatedEventsByCourseCode[courseCode] = {};
              eventDateByCourseCode.push({ courseCode: courseCode, date: date});
            }

            if(!Object.keys(separatedEventsByCourseCode[courseCode]).includes(dateString)) {
              separatedEventsByCourseCode[courseCode][dateString] = [];
            }

            separatedEventsByCourseCode[courseCode][dateString].push(event);
            return event;
          });

          const sortedDates = eventDateByCourseCode.sort(function(a, b) {
            const diff = moment(a.date).diff(moment(b.date));
            return diff === 0 ? a.courseCode > b.courseCode : diff;
          })

          let finalEventsByCourseCode = {}
          sortedDates.forEach(function(sorted) {
            finalEventsByCourseCode[sorted.courseCode] = separatedEventsByCourseCode[sorted.courseCode];
          });

          if(Object.keys(finalEventsByCourseCode).length === 0) {
            this.set("noGroupToShow", true);
          }

          resolve(finalEventsByCourseCode);
        }, err => {
          console.error(err);
          reject(err);
        });
      }
      else {
        this.set("noGroupToShow", true);
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
