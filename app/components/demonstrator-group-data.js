import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  header: ['Név', 'Neptun', 'Feladattípus', 'Feltöltés ideje', 'Beugró érdemjegy', 'Beadandó érdemjegy', 'Labor érdemjegy'],
  rowIndecies: ['StudentRegistration.User.displayName', 'StudentRegistration.User.neptun', 'ExerciseSheet.ExerciseType.shortName', 'firstCorrectableDeliverable.formattedLastSubmittedDate', 'firstEntryTest.grade', 'firstCorrectableDeliverable.grade', 'grade'],

  sortedEvents: Ember.computed.sort('events', function(lhs, rhs) {
    const lhsName = lhs.get('StudentRegistration.User.displayName'), rhsName = rhs.get('StudentRegistration.User.displayName');
    const lhsAttempt = lhs.get('attempt'), rhsAttempt = rhs.get('attempt');

    if (lhsAttempt > rhsAttempt) {
      return -1;
    }

    if (lhsAttempt < rhsAttempt) {
      return 1;
    }

    return lhsName.localeCompare(rhsName);
  }),

  eventGroup: Ember.computed('events', function() {
    return this.get('events.firstObject.CourseCode');
  }),

  eventPlace: Ember.computed('events', function() {
    return this.get('events.firstObject.location');
  }),

  eventDate: Ember.computed('events', function() {
    return this.get('events.firstObject.date');
  }),

  eventDeadline: Ember.computed('events', function(){
    return this.get('events.firstObject.eventDeadline');
  }),

  actions: {
    evaluateEvent(event) {
      return this.sendAction('evaluateEvent', event);
    }
  }
});
