import Ember from 'ember';

export default Ember.Controller.extend({
    user: Ember.computed(function() {
      return this.get('store').createRecord('user', {});
    }),

    actions: {
        create() {
          this.set('error', undefined);
          this.set('success', false);
          this.get('user').save().then(() => {
            this.set('success', true);
          }, t => {
            if (t.errors && t.errors.length > 0 && t.errors[0].title) {
              this.set('error', t.errors[0].title);
            }
          });
          return false;
        }
    }

});
