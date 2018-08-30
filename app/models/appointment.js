import DS from 'ember-data';

export default DS.Model.extend({
  StudentGroups: DS.hasMany('studentGroup', {inverse: 'Appointments'})
});
