import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  tagName: '',

  actions: {
    upload(event) {
      const files = event.target.files;
      if (!Ember.isEmpty(files)) {
        const formData = new FormData();
        const errorMessage = data => {
          this.sendAction('failed', data);
        };
        formData.append('file', files[0]);
        this.sendAction('started');
        Ember.$.ajax({
          type: "POST",
          url: this.get('url'),
          data: formData,
          beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Bearer ${this.get('session.data.authenticated.token')}`); },
          contentType: false,
          processData: false,
          crossDomain: true,
          success: () => {
            this.sendAction('success');
            event.target.value = '';
          },
          failure: errorMessage,
          statusCode: {
            500: errorMessage,
            404: errorMessage,
            403: errorMessage,
          }
        });
      }
      return false;
    }
  }
});
