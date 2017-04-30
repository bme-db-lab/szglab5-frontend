import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr('date'),
  location: DS.attr('string'),
  attempt: DS.attr('integer'),
  comment: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  Deliverables: DS.hasMany('deliverable', {inverse: 'Events'}),
  StudentRegistrations: DS.belongsTo('studentRegistration', {inverse: 'Events'}),
  //Users: DS.belongsTo('user', {inverse: 'Events'})
});
