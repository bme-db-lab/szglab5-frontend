import Ember from 'ember';
import moment from 'moment';
import env from "../../config/environment"

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  handoutDownloadError: null,
  handoutDownloadIsLoading: false,

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
        const filename = handoutUrl.replace(new RegExp(/\/events\/[\d]+\/get-handout\//g), '');
        this.set('handoutDownloadIsLoading', true);

        fetch(env.backendUrl + handoutUrl, {
            headers: {
              Authorization: `Bearer ${this.get('session.data.authenticated.token')}`
            }
        }).then((response) => {
          if (response.ok) {
            return response.blob();
          }
          throw response;
        })
        .catch((response) => {
          response.json().then((res) => {
            if (res.errors && res.errors.length > 0 && res.errors[0].title) {
              this.set('handoutDownloadError', res.errors[0].title);
              this.set('handoutDownloadIsLoading', false);
              return;
            }
            this.set('handoutDownloadError', "Something went wrong while trying to download the handout file.");
            this.set('handoutDownloadIsLoading', false);
          })
          .catch((error) => {
            console.error(error);
            this.set('handoutDownloadError', "Something went wrong while trying to download the handout file.");
            this.set('handoutDownloadIsLoading', false);
          })
        }).then((blob) => {
            if (blob) {
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
              this.set('handoutDownloadIsLoading', false);
            }
          });
      }
      else {
        this.set('handoutDownloadError', "Download url was not provided for this event.");
      }
    }
  }
});
