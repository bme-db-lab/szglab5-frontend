import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string'),
  type: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  Deliverables: DS.hasMany('deliverable', { inverse: 'DeliverableTemplate' }),
  EventTemplate: DS.belongsTo('eventTemplate', { inverse: 'DeliverableTemplates' }),

  exerciseCategory: Ember.computed('EventTemplate', function() {
    return this.get('EventTemplate.exerciseCategory');
  })
});
