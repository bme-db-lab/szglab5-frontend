import Ember from 'ember';
import RSVP from 'rsvp';
import config from '../config/environment';
import { dateformat } from '../helpers/dateformat';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],

  header: ['Név', 'Neptun', "Csoport", 'Feladattípus', 'Feltöltés ideje', 'Beugró érdemjegy', 'Beadandó érdemjegy', 'Labor érdemjegy', 'Pót'],
  rowIndecies: ['StudentRegistration.User.displayName', 'StudentRegistration.User.neptun', 'StudentRegistration.neptunCourseCode', 'ExerciseSheet.ExerciseType.shortName', 'firstCorrectableDeliverable.formattedLastSubmittedDate', 'firstEntryTest.grade', 'firstCorrectableDeliverable.grade', 'grade', 'supplementary'],

  eventGroup: Ember.computed('events', function(){
    return this.get('events').then (function(events){
      return events.get('firstObject.StudentRegistration.neptunCourseCode');
    });
  }),
  eventPlace: Ember.computed('events', function(){
    return this.get('events').then (function(events){
      return events.get('firstObject.location');
    });
  }),
  eventDate: Ember.computed('events', function(){
    return this.get('events').then (function(events){
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
