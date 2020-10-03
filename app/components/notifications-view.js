import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set('body', []);
  },

  header: ['Publikálva', 'Író', 'Cím'],
  rowIndecies: ['published', 'publisher', 'title'],
  showSettings: false,

  getBody: Ember.computed('model', 'model.@each', 'model.@each.title', function () {
    return new RSVP.Promise((resolve, reject) => {
      const loading = [];
      this.get('model').forEach(x => {
        loading.push(x.get('publisherName'));
      });
      RSVP.Promise.all(loading).then(data =>
        resolve(
          this.get('model').map((x, i) => ({
            published: x.get('publishedFormatted'),
            publisher: data[i],
            title: x.get('title'),
            notification: x
          }))), () => reject());
    });
  }),

  actions: {
    openSettings: function (tableElement) {
      let notification = tableElement.notification;
      if (notification) {
        this.set('notification', notification);
        this.toggleProperty('showSettings');
      }
      return false;
    },

    closeSettings: function () {
      this.set('notification', {});
      this.toggleProperty('showSettings');
      return false;
    },

    delete: function (tableElement) {
      let notification = tableElement.notification;
      notification.destroyRecord();
      return false;
    }
  }
});
