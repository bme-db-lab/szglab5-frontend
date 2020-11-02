import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
    separatedDeliverablesByExerciseType: Ember.computed(function () {
        return new RSVP.Promise((resolve, reject) => {
          this.get('store').query('deliverable', {
            filter: {
                isAttached: true,
                isFile: true,
                finalized: true
              }
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
      changeDeliverable(deliverable) {
        this.transitionToRoute("evaluator.booked.deliverable", deliverable.get('id'));
        return false;
      }
    }
});
