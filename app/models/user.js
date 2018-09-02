import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr('date'),
  classroom: DS.attr('string'),
  displayName: DS.attr('string'),
  email: DS.attr('string'),
  email_official: DS.attr('string'),
  loginName: DS.attr('string'),
  mobile: DS.attr('string'),
  neptun: DS.attr('string'),
  newpwd: DS.attr('string'),
  oldpwd: DS.attr('string'),
  ownedExerciseID: DS.attr('string'),
  printSupport: DS.attr('string'),
  spec: DS.attr('string'),
  sshPublicKey: DS.attr('string'),
  studentgroup_id: DS.attr('string'),
  subscribedToEmailNotify: DS.attr('boolean'),
  subscribedToMailList: DS.attr('boolean'),
  title: DS.attr('string'),
  university: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  StudentRegistrations: DS.hasMany('studentRegistration', {inverse: 'User'}),
  Deliverables: DS.hasMany('deliverable', {inverse: 'Corrector'}),
  Roles: DS.hasMany('role'),
  Event: DS.hasMany('event', {inverse: 'Demonstrator'}), // TODO: maybe useless
  ExerciseTypes: DS.hasMany('exerciseType', {inverse: 'Users'}),
  StudentGroup: DS.belongsTo('studentGroup', {inverse: 'User'})
});
