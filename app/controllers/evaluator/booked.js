import Ember from 'ember';
import { dateformat } from '../../helpers/dateformat';

export default Ember.Controller.extend({
    header: [
        'Neptun',
        'Név',
        'Feltöltés ideje',
        'Határidő',
        'Javító',
        'Feladatkód',
        'Labor kód',
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
        'DeliverableTemplate.EventTemplate.ExerciseCategory.type',
        'DeliverableTemplate.description',
        'finalized',
        'grade',
        'imsc'
      ],

    deliverableFilters: [
        {
          filter: {
            isCorrector: true,
            isFile: true,
            finalized: false
          },
          value: 'Javításra vár'
        },
        {
          filter: {
            isAttached: true,
            isFile: true,
            finalized: true
          },
          value: 'Feladattípusaimhoz tartozó kijavított feladatok'
        }
      ],

    page: 0,
    filteredDeliverablesSelect: [],
    filteredDeliverables: [],

    selectedExerciseType: null,
    selectedEventTemplate: null,
    selectedDeliverableTemplate: null,
    selectedDeliverableFilter: Ember.computed(function() {
        return this.deliverableFilters[0];
      }),

    actions: {
        changeDeliverableFilter(selected) {
            // reset page if the filter is changed
            this.set('selectedDeliverableFilter', selected);
            this.actions.resetPage.apply(this);
          },

        // changes event template in the filter
        changeEventTemplate(eT) {
          this.set('selectedEventTemplate', eT);
          this.set('selectedDeliverableTemplate', '');
          this.actions.resetPage.apply(this);
          return false;
        },

        // load deliverables by filter
          loadFilteredDeliverables() {
            const filter = this.get('selectedDeliverableFilter.filter');

            // filter for event template
            if (this.get('selectedEventTemplate')) {
              filter.eventTemplateId = this.get('selectedEventTemplate.id');
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
              this.set('filteredDeliverables', [
                ...this.get('filteredDeliverables'),
                ...deliverables.map(x => x)
              ]);
              this.set('page', this.get('page') + 1);
            });
            return false;
          },

        changeDeliverable(deliverable) {
          this.set('success', false);
          this.set('error', '');
          this.transitionToRoute("evaluator.booked.deliverable", deliverable.get('id'));
          return false;
        },

        resetPage() {
            this.set('page', 0);
            this.set('filteredDeliverablesSelect', []);
            this.set('filteredDeliverables', []);
            this.actions.loadFilteredDeliverables.apply(this);
            return false;
        }
    }
});
