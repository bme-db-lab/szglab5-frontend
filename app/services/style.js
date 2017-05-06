import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  selected: null,
  selectable: null,
  init() {
    this._super(...arguments);
    this.set('selectable', []);
    this.get('selectable').push('blue-gray');
    this.get('selectable').push('blue');
    this.get('selectable').push('pink');
    this.get('selectable').push('pink-gray');
    this.get('selectable').push('gray');
    this.get('selectable').push('green');
    this.get('selectable').push('green-gray');
    this.get('selectable').push('red');
    this.get('selectable').push('red-gray');
    this.get('selectable').push('yellow');
    this.get('selectable').push('yellow-gray');
    var selectedStyle = this.get('session').get('data.selectedStyle');
    if (selectedStyle) {
      this.set('selected', selectedStyle);
    }
    else {
      this.restoreDefault();
    }
  },
  changeStyle(style) {
    this.set('selected', style);
    this.get('session').set('data.selectedStyle',this.get('selected'));
  },
  restoreDefault() {
    this.changeStyle(this.get('selectable')[0]);
  }
});