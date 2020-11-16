import Ember from 'ember';
import moment from 'moment';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
  currentView: '',
  subMenu: Ember.computed('model.StudentRegistrations', function () {
    return new RSVP.Promise((resolve, reject) => {
      this.get('model.StudentRegistrations')
        .then((StudentRegistrations) => {
          let subMenuKeys = [];
          let promises = [];
          StudentRegistrations.forEach((studentRegistration) => { // as of mapBy
            const promise = studentRegistration.get('Events').then((events) => {
              events.forEach((event) => {
                subMenuKeys.push({
                  key: event.get('id'),
                  description: event.get('EventTemplate.name') + ((event.get('finalized')) ? ` (${event.get('grade')})` : ''),
                  event: event
                });
              });
            }, err => {
              console.error(err);
              reject(err);
            });
            promises.push(promise);
          });
          RSVP.Promise.all(promises).then(() => {
            // sort menupoints by date
            const sorted = subMenuKeys.sort((lhs, rhs) => {
              return moment(lhs.event.get('date')).diff(rhs.event.get('date'));
            });
            // select the first menu that has not been graded yet.
            this.set('currentView', null);
            sorted.forEach(m => {
              if (this.get('currentView') === null && Ember.isEmpty(m.event.get('grade'))) {
                this.set('currentView', m);
              }
            });
            // select the last if there's no not graded menupoint
            if (this.get('currentView') === null) {
              this.set('currentView', sorted[sorted.length - 1]);
            }
            resolve(sorted);
          }, err => {
            console.error(err);
            reject(err);
          });
        }, err => {
          console.error(err);
          reject(err);
        });
    });
  }),
  actions: {
    goToView(key) {
      this.get('subMenu').then((subMenu) => {
        subMenu.forEach((se) => {
          if (key === se.key) {
            this.set('currentView', se);
            return false;
          }
        });
      });
      return false;
    },
    selectCommit(newcommit) {
      console.log("Todo save new commit: " + newcommit);
      return false;
    }
  }
});
