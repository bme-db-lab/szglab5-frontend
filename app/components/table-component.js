import Ember from 'ember';

export default Ember.Component.extend({
  showHighlight: false,

  actions: {
    onRowClick(rowData) {
      if (this.get('clickable')) {
        return this.sendAction(this.get('onClickRowAction'), rowData);
      } else {
        return false;
      }
    },

    openSettings(rowData) {
      return this.sendAction('openSettings', rowData);
    },

    check(rowData) {
      rowData.meta.toggleProperty('checked');
      return false;
    },

    impersonate(rowData) {
      return this.sendAction('impersonate', rowData);
    },

    delete(rowData) {
      return this.sendAction('delete', rowData);
    }
  }
});
