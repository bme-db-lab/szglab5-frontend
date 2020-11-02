import Ember from 'ember';
import dateformat from "../../helpers/dateformat"

export default Ember.Component.extend({
    header: [
        'Neptun',
        'Név',
        'Feltöltés ideje',
        'Határidő',
        'Feladattípus',
        'Labor kód',
        'Beadandó'
    ],
    rowIndecies: [
        'Event.StudentRegistration.User.neptun',
        'Event.StudentRegistration.User.displayName',
        'uploadedAt',
        'deadlineFormatted',
        'Event.ExerciseSheet.ExerciseType.shortName',
        'DeliverableTemplate.EventTemplate.ExerciseCategory.type',
        'DeliverableTemplate.description'
    ],

    actions: {
        changeDeliverable(event) {
          return this.sendAction('changeDeliverable', event);
        }
      }
});
