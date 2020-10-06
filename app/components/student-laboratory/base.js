import Ember from 'ember';
import moment from 'moment';
import env from "../../config/environment"

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

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
    },

    downloadHandout() {
      const handoutUrl = this.get('result.handoutUrl');

      if (handoutUrl) {
        const filename = handoutUrl.replace(new RegExp(/\/events\/[\d]+\/get-handout\//g), '');

        fetch(env.backendUrl + handoutUrl, {
            headers: {
              Authorization: `Bearer ${this.get('session.data.authenticated.token')}`
            }
        }).then((response) => response.blob())
          .then((blob) => {
            // from: https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = filename || 'download';

            const clickHandler = () => {
              setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
                a.remove();
              }, 150);
            };

            a.addEventListener('click', clickHandler, false);
            a.click();
          });
      }
    }
  }
});
