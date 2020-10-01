import Ember from 'ember';
import RSVP from 'rsvp';
import config from '../config/environment';
import { dateformat } from '../helpers/dateformat';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  events: Ember.computed('currentEventTemplate', function () {
    return new RSVP.Promise((resolve, reject) => {
      if (this.get('currentEventTemplate.id')) {
        this.get('store').query('event', {
          filter: {
            eventTemplateId: this.get('currentEventTemplate.id')
          }
        }).then(events => {
          let body = [];
          resolve(events
            .map(event => {
              event.set('formattedDate', dateformat([event.get('date')]));
              return event;
            })
            .sort((lhs, rhs) => {
              const lhsName = lhs.get('StudentRegistration.User.displayName'), rhsName = rhs.get('StudentRegistration.User.displayName');
              const lhsAttempt = lhs.get('attempt'), rhsAttempt = rhs.get('attempt');

              if (lhsAttempt > rhsAttempt) {
                return -1;
              }

              if (lhsAttempt < rhsAttempt) {
                return 1;
              }

              if (lhsAttempt === rhsAttempt) {
                if (lhsName < rhsName) {
                  return -1;
                }
                if (lhsName > rhsName) {
                  return 1;
                }
              }
              return 0;
            })
          );
        }, err => {
          console.error(err);
          reject(err);
        });
      }
      else {
        resolve([]);
      }
    });
  }),

  actions: {
    evaluateEvent(event) {
      return this.sendAction('evaluateEvent', event);
    }
  }
});
