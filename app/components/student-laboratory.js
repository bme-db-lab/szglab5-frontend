import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  exerciseShortName: Ember.computed('result', 'result.ExerciseSheet', function () {
    if (this.get('result') && this.get('result.ExerciseSheet')) {
      return this.get('result.ExerciseSheet.ExerciseType').then(exerciseType => {
        return exerciseType.get('shortName');
      });
    }
  }),

  init() {
    this._super();
    return this.tick();
  },

  tick() {
    this.toggleProperty("toggleTime");
    return setTimeout(() => {
      this.tick();
    }, 1000 * 60 * 15);
  },

  toggleTime: true,
  timeLeft: Ember.computed('toggleTime', 'result', function () {
    this.get('toggleTime'); // this is needed, otherwise the toggletime change won't trigger it.
    const deadline = this.get('result.firstCorrectableDeliverable.deadline'); // TODO: do for each deliverable, maybe with different components
    return moment(deadline).fromNow();
  }),

  actions: {
    selectCommit(Deliverable, newcommit) {
      Deliverable.set('success', null);
      Deliverable.set('fail', null);
      Deliverable.set('commit', newcommit);
      Deliverable.save().then(() => {
        Deliverable.set('success', true);
      }).catch(() => {
        Deliverable.set('fail', true);
      });
      return false;
    }
  }
});
