import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['change-time'],

  error: '',
  success: false,
  hours: 0,
  minutes: 0,
  date: new Date(),

  lastSubmittedDate: Ember.computed('Deliverable.lastSubmittedDate', function () {
    let date = this.get('Deliverable.lastSubmittedDate');
    if (date === null) {
      return new Date();
    }
    this.set('hours', date.getHours());
    this.set('minutes', date.getMinutes());
    this.set('date', date);
    return date;
  }),

  actions: {
    save() {
      this.set('success', false);
      this.set('error', '');
      let date = this.get('date');
      this.set('Deliverable.lastSubmittedDate', new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.get('hours'), this.get('minutes')));
      this.get('Deliverable').save().then(() => {
        this.set('success', true);
      }, (t) => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          this.set('error', t.errors[0].title);
        }
      });
      return false;
    }
  }
});
