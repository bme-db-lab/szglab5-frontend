import Ember from 'ember';

export function hasKey(params/*, hash*/) {
  return params[0].indexOf(params[1]) !== -1;
}

export default Ember.Helper.helper(hasKey);
