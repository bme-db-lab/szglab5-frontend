import Ember from 'ember';
import RSVP from 'rsvp';


export default Ember.Controller.extend({
    myExerciseTypes: Ember.computed('model.user.ExerciseTypes', 'model.user.ExerciseTypes.[]', 'model.user.ExerciseTypes.@each', function () {
        return this.get('model.user.ExerciseTypes');
    }),

    separatedDeliverablesByExerciseType: Ember.computed('model', function () {
      return new RSVP.Promise((resolve, reject) => {
        this.get('store').query('deliverable', {
          filter: {
            isFree: true,
            isAttached: true,
            isOver: true,
            isFile: true,
            isUploaded: true
          }
        }).then(deliverables => {
          let separatedDeliverablesByExerciseType = {}

          deliverables.map(deliverable => {
            const exerciseCategoryType = deliverable.get('exerciseCategoryType');
            if(!Object.keys(separatedDeliverablesByExerciseType).includes(exerciseCategoryType)) {
              separatedDeliverablesByExerciseType[exerciseCategoryType] = [];
            }

            separatedDeliverablesByExerciseType[exerciseCategoryType].push(deliverable);
            return deliverable;
          });

          resolve(separatedDeliverablesByExerciseType);
        }, err => {
          console.error(err);
          reject(err);
        });
      });
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



        changeDeliverable(deliverable) {
          this.transitionToRoute("evaluator.to-fix.deliverable", deliverable.get('id'));
          return false;
        }
    }
});
