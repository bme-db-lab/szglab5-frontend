import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  neptun: "",
  error: "",
  student: null,
  session: Ember.inject.service('session'),
  selectedEventTemplate: null,
  selectedGroup: null,
  resetGrades: false,

  resetValues(resetStudent) {
    this.set('errorSearch', null);
    this.set('successSave', null);
    this.set('errorSave', null);

    this.set('selectedEventTemplate', null);
    this.set('selectedGroup', null);
    this.set('resetGrades', false);

    if (resetStudent) {
      this.set('student', null);
    }
  },

  // block the save button if the current new group is empty
  // block if the selectedEventTemplate is empty
  blockSaveButton: Ember.computed('selectedGroup', 'selectedEventTemplate', 'student', function() {
    let group = this.get('selectedGroup');
    let eventTemplate = this.get('selectedEventTemplate');
    let student = this.get('student');

    // check if group or eventTemplate is empty
    if (eventTemplate === null || eventTemplate === undefined || group === null || group === undefined) {
      return true;
    }
    return false;
  }),

  actions: {
    // search for student by neptun
    searchStudent() {
      this.resetValues(true);

      if(this.get('neptun').length === 0) {
        return;
      }


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
            this.set('errorSearch', "Nem létező hallgató");
            return;
          }
          this.set('errorSearch', error.statusText);
          return;
        }
      });
    },

    // resetEverything
    resetButton() {
      this.resetValues();
      return;
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
      this.set('errorSearch', null);
      this.set('successSave', null);
      this.set('errorSave', null);

      let json = {
        "studentNeptun": this.get('student.neptun'),
        "newStudentGroupId": this.get('selectedGroup.id'),
        "eventTemplateId": this.get('selectedEventTemplate.eventTemplateId'),
        "resetGrades": this.get('resetGrades')
      };

      Ember.$.ajax({
        type: "POST",
        url: `${config.backendUrl}/users-change-group`,
        data: JSON.stringify(json),
        beforeSend: (xhr) => {
          xhr.setRequestHeader('Authorization', `Bearer ${this.get('session.data.authenticated.token')}`);
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        // on success save the new student
        success: (response) => {
          this.set('successSave', "Sikeres mentés");
          return;
        },
        // on error delete the student and show error message
        error: (error) => {
          this.set('successSave', null);
          this.set('errorSave', "Sikertelen mentés");
          return;
        }
      });
      return;
    }
  }
});
