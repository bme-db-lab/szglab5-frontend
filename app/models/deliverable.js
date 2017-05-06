import DS from 'ember-data';

export default DS.Model.extend({
  deadline: DS.attr('date'),
  submitteddate: DS.attr('date'),
  grade: DS.attr('number'),
  comment: DS.attr('string'),
  url: DS.attr('string'),
  commit: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  Events: DS.hasMany('event', {inverse: 'Deliverables'}),
  DeliverableTemplate: DS.belongsTo('deliverableTemplate', {inverse: 'Deliverables'}),
  Users: DS.hasMany('deliverableTemplate', {inverse: 'Deliverables'})
});