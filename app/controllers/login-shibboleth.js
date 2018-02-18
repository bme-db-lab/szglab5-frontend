import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['redirect', 'errorMessage'],
  redirect: null,
});
