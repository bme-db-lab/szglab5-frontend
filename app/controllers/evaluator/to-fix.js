import Ember from 'ember';
import { dateformat } from '../../helpers/dateformat';

export default Ember.Controller.extend({
    queryParams: ['page', 'pageSize'],
    page: 0,
    pageSize: 50,

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

    myExerciseTypes: Ember.computed('model.user.ExerciseTypes', 'model.user.ExerciseTypes.[]', 'model.user.ExerciseTypes.@each', function () {
        return this.get('model.user.ExerciseTypes');
    }),


    filteredDeliverables: [],

    actions: {
        // changes deliverable template in the filter
        changeExerciseType(eT) {
          this.set('selectedExerciseType', eT);
          this.actions.resetPage.apply(this);
          return false;
        },
        // changes event template in the filter
        changeEventTemplate(eT) {
          this.set('selectedEventTemplate', eT);
          this.set('selectedDeliverableTemplate', '');
          this.actions.resetPage.apply(this);
          return false;
        },
        // changes deliverable template in the filter
        changeDeliverableTemplate(dT) {
          this.set('selectedDeliverableTemplate', dT);
          this.actions.resetPage.apply(this);
          return false;
        },


        // load deliverables by filter
        loadFilteredDeliverables() {
          const filter = {
            isFree: true,
            isAttached: true,
            isOver: true,
            isFile: true,
            isUploaded: true
          };
          if (this.get('selectedExerciseType')) {
            filter.exerciseTypeId = this.get('selectedExerciseType.id');
          }
          if (this.get('selectedEventTemplate')) {
            filter.eventTemplateId = this.get('selectedEventTemplate.id');
          }
          if (this.get('selectedDeliverableTemplate')) {
            filter.deliverableTemplateId = this.get('selectedDeliverableTemplate.id');
          }
          const pageSize = 50;
          this.get('store').query('deliverable', {
            filter: filter,
            offset: pageSize * this.get('page'),
            limit: pageSize
          }).then(deliverables => {
            deliverables.forEach(x => {
              x.set('uploadedAt', x.get('uploaded') ? dateformat([x.get('lastSubmittedDate')]) : 'No');
              x.set('deadlineFormatted', dateformat([x.get('deadline')]));
            });
            this.set('filteredDeliverablesSelect', [
              ...this.get('filteredDeliverablesSelect'),
              ...deliverables.map(x => x)
            ]);
            this.set('page', this.get('page') + 1);
          });
          return false;
        },

        changeDeliverable(deliverable) {
          this.set('success', false);
          this.set('error', '');
          this.transitionToRoute("evaluator.to-fix.deliverable", deliverable.get('id'));
          return false;
        },

        // resetPage
        resetPage() {
            this.set('page', 0);
            this.set('filteredDeliverablesSelect', []);
            this.set('filteredDeliverables', []);
            this.actions.loadFilteredDeliverables.apply(this);
            return false;
        }
    }
});
