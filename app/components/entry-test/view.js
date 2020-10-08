import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  exerciseCategory: null,
  question: null,

  init() {
    this._super(...arguments);
    this.set('body', []);
  },

  header: ['Szöveg', 'Nyelv'],
  rowIndecies: ['text', 'language'],
  showSettings: false,

  getBody: Ember.computed('exerciseCategory', 'exerciseCategory.Questions.@each.text', 'exerciseCategory.Questions.@each.checked', function () {
    return this.get('exerciseCategory.Questions').map(
      x => ({
        text: x.get('text'),
        language: 'TODO',
        // TODO: language: x.get('language.name'),
        checked: x.get('checked'),
        meta: x
      })
    );
  }),

  actions: {
    openSettings(question) {
      var editQuestion = question.meta;
      if (editQuestion) {
        this.set('question', editQuestion);
      }
      return false;
    },

    closeSettings() {
      this.get('question').rollbackAttributes();
      this.set('question', null);
      return false;
    },

    delete(question) {
      question.meta.destroyRecord();
      return false;
    },

    newQuestion() {
      this.set('question', this.get('store').createRecord('question', {
        ExerciseCategory: this.get('exerciseCategory'),
        text: ''
      }));
      return false;
    },

    print() {
      const ids = this.get('exerciseCategory.Questions').filter(x => x.get('checked')).map(
        x => x.get('id')
      );
      const form = document.createElement('form');
      form.setAttribute('target', '_blank');
      form.setAttribute('method', 'post');
      form.setAttribute('action', config.backendUrl + '/generatePDF?' + Ember.$.param({ questionId: ids }));
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'token');
      hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
      form.appendChild(hiddenInput);
      document.body.appendChild(form);
      form.submit();
      form.remove();
      return false;
    }
  }
});
