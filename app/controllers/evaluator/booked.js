import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
    deliverableFilters: [
        {
          filter: {
            isCorrector: true,
            isFile: true,
            finalized: false
          },
          showHighlight: true,
          value: 'Javításra vár'
        },
        {
          filter: {
            isAttached: true,
            isFile: true,
            finalized: true
          },
          showHighlight: false,
          value: 'Feladattípusaimhoz tartozó kijavított feladatok'
        }
      ],

    selectedDeliverableFilter: Ember.computed(function() {
        return this.deliverableFilters[0];
      }),

    separatedDeliverablesByExerciseType: Ember.computed('selectedDeliverableFilter', function () {
      const selectedDeliverableFilter = this.get('selectedDeliverableFilter');
        return new RSVP.Promise((resolve, reject) => {
          this.get('store').query('deliverable', {
            filter: selectedDeliverableFilter.filter
          }).then(deliverables => {
            let separatedDeliverablesByExerciseType = {}
            let categoryById = []

            deliverables.map(deliverable => {
              const exerciseCategory = deliverable.get('exerciseCategory');
              const exerciseCategoryType = exerciseCategory.get('type');
              if(!Object.keys(separatedDeliverablesByExerciseType).includes(exerciseCategoryType)) {
                separatedDeliverablesByExerciseType[exerciseCategoryType] = [];
                categoryById.push({ type: exerciseCategoryType, id: parseInt(exerciseCategory.get('id'))});
              }

              separatedDeliverablesByExerciseType[exerciseCategoryType].push(deliverable);
              return deliverable;
            });

            const sortedCategories = categoryById.sort(function(a, b) {
              return a.id - b.id;
            })

            let finalDeliverablesByExerciseType = {}
            sortedCategories.forEach(function(sorted) {
              finalDeliverablesByExerciseType[sorted.type] = separatedDeliverablesByExerciseType[sorted.type];
            });

            resolve(finalDeliverablesByExerciseType);
          }, err => {
            console.error(err);
            reject(err);
          });
        });
      }),

    actions: {
      changeDeliverableFilter(selected) {
          this.set('selectedDeliverableFilter', selected);
        },

      changeDeliverable(deliverable) {
        this.transitionToRoute("evaluator.booked.deliverable", deliverable.get('id'));
        return false;
      }
    }
});
