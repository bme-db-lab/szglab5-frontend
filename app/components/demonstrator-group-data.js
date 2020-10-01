import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  header: ['Név', 'Neptun', "Csoport", 'Feladattípus', 'Feltöltés ideje', 'Beugró érdemjegy', 'Beadandó érdemjegy', 'Labor érdemjegy', 'Pót'],
  rowIndecies: ['StudentRegistration.User.displayName', 'StudentRegistration.User.neptun', 'CourseCode', 'ExerciseSheet.ExerciseType.shortName', 'firstCorrectableDeliverable.formattedLastSubmittedDate', 'firstEntryTest.grade', 'firstCorrectableDeliverable.grade', 'grade', 'supplementary'],

  sortedEvents: Ember.computed('events', 'events.[]', function() {
    return this.get('events').then(function(events) {
      return events.sort((lhs, rhs) => {
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
    })
  }),

  eventGroup: Ember.computed('events', function() {
    return this.get('events').then (function(events) {
      return events.get('firstObject.CourseCode');
    });
  }),
  eventPlace: Ember.computed('events', function() {
    return this.get('events').then (function(events) {
      return events.get('firstObject.location');
    });
  }),
  eventDate: Ember.computed('events', function() {
    return this.get('events').then (function(events) {
      var date = events.get('firstObject.date');
      return date;
    });
  }),
  eventDeadline: Ember.computed('events', function(){
    return this.get('events').then (function(events){
      var date = events.get('firstObject.eventDeadline');
      return date;
    });
  }),

  actions: {
    evaluateEvent(event) {
      return this.sendAction('evaluateEvent', event);
    }
  }
});
