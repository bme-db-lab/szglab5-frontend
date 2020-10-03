import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['student-registration'],
  semesterName: Ember.computed(function() {
    return this.get('StudentRegistration.Semester').then(semester => {
      return `${semester.get('academicyear')}/${semester.get('academicterm')}`;
    });
  }),
  actions: {
    definalize(deliverable) {
      deliverable.set('success', false);
      deliverable.set('error', '');
      deliverable.set('finalized', false);
      deliverable.save().then(() => {
        deliverable.set('success', true);
      }, (t) => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          deliverable.set('error', t.errors[0].title);
        }
      });
      return false;
    }
  }
});
