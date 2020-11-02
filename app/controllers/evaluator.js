import Ember from 'ember';

export default Ember.Controller.extend({
  subMenu: [
    {
      route: 'evaluator.to-fix',
      description: 'Javítandó kiválasztása'
    }, {
      route: 'evaluator.booked',
      description: 'Javítás'
    }, {
      route: 'evaluator.fixed',
      description: 'Kijavított feladatok'
    }
  ]
});
