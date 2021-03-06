import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  published: DS.attr('date'),
  from: DS.attr('date'),
  until: DS.attr('date'),
  admins: DS.attr('boolean'),
  students: DS.attr('boolean'),
  demonstators: DS.attr('boolean'),
  evaluators: DS.attr('boolean'),
  onLogin: DS.attr('boolean'),
  publisher: DS.belongsTo('user'),
  Languages: DS.belongsTo('language', {inverse: 'News'}),
  // Language: DS.belongsTo('language'),
  // Semester: DS.belongsTo('semester'),
  publishedFormatted: Ember.computed('published', function () {
    return moment(this.get('published')).format('YYYY.MM.DD.');
  }),
  fromFormatted: Ember.computed('from', function () {
    return moment(this.get('from')).format('YYYY.MM.DD.');
  }),
  untilFormatted: Ember.computed('until', function () {
    return moment(this.get('until')).format('YYYY.MM.DD.');
  }),
  publisherName: Ember.computed('publisher', function () {
    return this.get('publisher').then(user => {
      if (user === null) {
        return '';
      }
      return user.get('displayName');
    });
  }),
  publisherNameIncluded: Ember.computed('publisher', function () {
    return this.get('publisher.displayName');
  }),

  currentDate: Ember.computed(function () {
    return new Date();
  })
});
