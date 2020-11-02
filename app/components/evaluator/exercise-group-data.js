import Ember from 'ember';

export default Ember.Component.extend({
    header: [
        'Neptun',
        'Név',
        'Feltöltés ideje',
        'Határidő',
        'Feladattípus',
        'Beadandó'
    ],
    rowIndecies: [
        'Event.StudentRegistration.User.neptun',
        'Event.StudentRegistration.User.displayName',
        'uploadedAt',
        'deadlineFormatted',
        'Event.ExerciseSheet.ExerciseType.shortName',
        'DeliverableTemplate.description'
    ],

    showHighlight: false,

    actions: {
        changeDeliverable(event) {
          return this.sendAction('changeDeliverable', event);
        }
      }
});
