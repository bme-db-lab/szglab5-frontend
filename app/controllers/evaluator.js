import Ember from 'ember';

export default Ember.Controller.extend({
  subMenu: [
    {
      route: 'evaluator.to-fix',
      description: 'Javítandó kiválasztása'
    }, {
      route: 'evaluator.booked',
      description: 'Javítás és kijavított feladatok'
    }
  ]
});
