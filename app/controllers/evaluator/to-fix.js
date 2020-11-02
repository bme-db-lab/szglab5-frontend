import Ember from 'ember';

export default Ember.Controller.extend({
  separatedDeliverablesByExerciseType: Ember.computed('model', 'model.deliverables', function () {
    const deliverables = this.get('model.deliverables');
    let separatedDeliverablesByExerciseType = {};
    let categoryById = [];

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

    return finalDeliverablesByExerciseType;

  }),

    actions: {
        changeDeliverable(deliverable) {
          this.transitionToRoute("evaluator.to-fix.deliverable", deliverable.get('id'));
          return false;
        }
    }
});
