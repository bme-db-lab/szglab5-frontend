import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';
import moment from 'moment';
import { dateformat } from '../helpers/dateformat'

export default DS.Model.extend({
  deadline: DS.attr('date'),
  lastSubmittedDate: DS.attr('date'),
  grade: DS.attr('number'),
  grading: DS.attr('boolean'),
  imsc: DS.attr('number'),
  comment: DS.attr('string'),
  finalized: DS.attr('boolean'),
  url: DS.attr('string'),
  commit: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  uploaded: DS.attr('boolean'),
  Event: DS.belongsTo('event', { inverse: 'Deliverables' }),
  DeliverableTemplate: DS.belongsTo('deliverableTemplate', { async: false, inverse: 'Deliverables' }),
  Corrector: DS.belongsTo('user', { async: false, inverse: 'Deliverables' }),
  Student: DS.belongsTo('user', { async: false }),
  isOver: Ember.computed('deadline', function () {
    return (this.get('deadline') - (new Date())) < 0;
  }),
  isUploadable: Ember.computed(function () {
    return !this.get('isOver') || // this deadline is not over OR
      (this.get('isOver') && // the deadline is over,
        (this.get('lastSubmittedDate') < this.get('deadline')) && // but the last upload time is before the deadline and
        !this.get('uploaded') && // hasn't been uploaded yet and
        ((new Date()) - this.get('deadline')) < 13 * 60 * 60 * 1000 // the deadline is over at most 13 hours
      );
  }),
  isDelayed: Ember.computed('deadline', 'uploaded', 'lastSubmittedDate', function () {
    return !(this.get('lastSubmittedDate') &&
      ((this.get('deadline') - this.get('lastSubmittedDate')) > 0));
  }),
  delayCalculation: Ember.computed('deadline','uploaded', 'lastSubmittedDate', function(){
    return moment(this.get('lastSubmittedDate')).diff(moment(this.get('deadline')),'hours', true);
  }),
  downloadLink: Ember.computed('id', function () {
    return `${config.backendUrl}/deliverables/${this.get('id')}/download`;
  }),
  uploadUrl: Ember.computed('id', function () {
    return `${config.backendUrl}/deliverables/${this.get('id')}/upload`;
  }),
  CorrectorName: Ember.computed('Corrector', 'Corrector.displayName', function () {
    return this.get('Corrector.displayName');
  }),
  CorrectorEmail: Ember.computed('Corrector', 'Corrector.displayName', function () {
    return this.get('Corrector.email_official');
  }),
  description: Ember.computed.oneWay('DeliverableTemplate.description'),

  formattedLastSubmittedDate: Ember.computed('lastSubmittedDate', function(){
    var date = this.get('lastSubmittedDate');
    if (date && date.getFullYear) {
      var r = date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ". ";
      r += (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
      r += ":";
      r += (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
      return r;
    }
    return "";
  }),

  uploadedAt: Ember.computed('uploaded', 'formattedLastSubmittedDate', function(){
    return this.get('uploaded') ? this.get('formattedLastSubmittedDate') : 'No'
  }),

  deadlineFormatted: Ember.computed('deadline', function() {
    return dateformat([this.get('deadline')]);
  }),

  exerciseCategory: Ember.computed('DeliverableTemplate', function() {
    return this.get('DeliverableTemplate.exerciseCategory');
  }),

  tableHighlight: Ember.computed('uploadedAt', function () {
    const uploadedAt = moment(this.get('uploadedAt'), "YYYY. MM. DD. hh:mm")
    const now = moment()
    const diff = now.diff(uploadedAt, 'days')

    if(diff > 5) {
      return "highlight-heavy";
    } else if(diff >= 3) {
      return "highlight-medium";
    }
    return "";
  }),
});
