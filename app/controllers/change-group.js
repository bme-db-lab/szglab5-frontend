import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  neptun: "Neptun5",
  error: "",
  student: null,
  session: Ember.inject.service('session'),
  selectedEventTemplate: null,
  selectedGroup: null,
  resetGrades: false,

  // block the save button if the current new group is the old group
  // block if the selectedEventTemplate is empty
  blockSaveButton: Ember.computed('selectedGroup', 'selectedEventTemplate', 'student', function() {
    let group = this.get('selectedGroup');
    let eventTemplate = this.get('selectedEventTemplate');
    let student = this.get('student');

    // check if group or eventTemplate is empty
    if (eventTemplate === null || eventTemplate === undefined || group === null || group === undefined) {
      return true;
    }

    // check if the two names match
    return group.get('name').toLowerCase() === student.studentGroup.toLowerCase();
  }),

  actions: {

    // search for student by neptun
    searchStudent() {
      let url = `${config.backendUrl}/users/neptun/` + this.get('neptun');

      Ember.$.ajax({
        type: "GET",
        url: url,
        beforeSend: (xhr) => {
          xhr.setRequestHeader('Authorization', `Bearer ${this.get('session.data.authenticated.token')}`);
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        // on success save the new student
        success: (student) => {
          this.set('student', student);
          return;
        },
        // on error delete the student and show error message
        error: (error) => {
          this.set('student', null);

          if (error.statusText.toLowerCase() === "not found") {
            this.set('error', "Nem létező hallgató");
            return;
          }

          this.set('error', error.statusText);
          return;
        }
      });
    },

    // select new template
    selectTemplate(template) {
      this.set('selectedEventTemplate', template);
      return;
    },

    // select new group
    selectGroup(group) {
      this.set('selectedGroup', group);
      return;
    },

    // toggle reset grades setting
    toggleResetGrades() {
      this.toggleProperty('resetGrades');
      return;
    },

    // save new group
    saveNewGroup() {
      return;
    }
  }


});
