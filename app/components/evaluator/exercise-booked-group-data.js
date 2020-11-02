import Ember from 'ember';

export default Ember.Component.extend({
    header: [
        'Neptun',
        'Név',
        'Feltöltés ideje',
        'Határidő',
        'Javító',
        'Feladatkód',
        'Beadandó típusa',
        'Kijavítva',
        'Érdemjegy',
        'IMSc'
      ],
    rowIndecies: [
        'Event.StudentRegistration.User.neptun',
        'Event.StudentRegistration.User.displayName',
        'uploadedAt',
        'deadlineFormatted',
        'CorrectorName',
        'Event.ExerciseSheet.ExerciseType.shortName',
        'DeliverableTemplate.description',
        'finalized',
        'grade',
        'imsc'
      ],

    actions: {
        changeDeliverable(event) {
          return this.sendAction('changeDeliverable', event);
        }
    }
});
