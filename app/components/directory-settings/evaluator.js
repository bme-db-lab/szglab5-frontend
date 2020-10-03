import Ember from 'ember';

export default Ember.Component.extend({
  currentTypes: Ember.computed('user.ExerciseTypes', 'user.ExerciseTypes.[]', 'user.ExerciseTypes.@each', function () {
    return this.get('user.ExerciseTypes').map(x => x.get('name'));
  }),
  classNames: ['directory-settings-evaluator'],
  actions: {
    toggleType(exerciseType) {
      const exerciseTypes = this.get('user.ExerciseTypes');
      if (exerciseTypes.indexOf(exerciseType) === -1) {
        exerciseTypes.pushObject(exerciseType);
      }
      else {
        exerciseTypes.removeObject(exerciseType);
      }
      return false;
    },
    save() {
      this.set('successfullSave', false);
      this.get('user').save().then(() => {
        this.set('successfullSave', true);
        this.toggleProperty('checkRoles');
      });
      return false;
    }
  }
});
