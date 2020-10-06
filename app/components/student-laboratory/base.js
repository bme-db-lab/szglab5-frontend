import Ember from 'ember';
import moment from 'moment';
import env from "../../config/environment"

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  handoutDownloadError: null,

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
      this.set('handoutDownloadError', null);

      if (handoutUrl) {
        const url = env.backendUrl + handoutUrl;
        Ember.$.get({
          url: url,
          beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Bearer ${this.get('session.data.authenticated.token')}`); },
          success: (pdf) => {
            var blob = new Blob([pdf], {type: 'application/pdf'});
            var a = document.createElement('a');
            var downloadUrl = window.URL.createObjectURL(blob);
            a.href = url;
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
          },
          error: (response) => {
            const responseText = JSON.parse(response.responseText);
            if (responseText.errors && responseText.errors.length > 0 && responseText.errors[0].title) {
              this.set('handoutDownloadError', responseText.errors[0].title);
            }
          }
        })
      }
    }
  }
});
