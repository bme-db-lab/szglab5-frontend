import Ember from 'ember';
import RSVP from 'rsvp';
import config from '../config/environment';
import { dateformat } from '../helpers/dateformat';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  classNames: ['demonstrator-group'],
  header: ['Név', 'Neptun', "Csoport", 'Feladattípus', 'Feltöltés ideje', 'Beugró érdemjegy', 'Beadandó érdemjegy', 'Labor érdemjegy', 'Pót'],
  rowIndecies: ['StudentRegistration.User.displayName', 'StudentRegistration.User.neptun', 'StudentRegistration.neptunCourseCode', 'ExerciseSheet.ExerciseType.shortName', 'firstCorrectableDeliverable.formattedLastSubmittedDate', 'firstEntryTest.grade', 'firstCorrectableDeliverable.grade', 'grade', 'supplementary'],


  download(supplementary) {
    const form = document.createElement('form');
    form.setAttribute('target', '_blank');
    form.setAttribute('method', 'post');
    form.setAttribute('action', `${config.backendUrl}/event-templates/${this.get('currentEventTemplate.id')}/listDownload.zip`);
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'token');
    hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
    form.appendChild(hiddenInput);
    hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'supplementary');
    hiddenInput.setAttribute('value', supplementary || false);
    form.appendChild(hiddenInput);
    document.body.appendChild(form);
    form.submit();
    form.remove();
    return false;
  },

  actions: {
    evaluateEvent(event) {
      return this.sendAction('evaluateEvent', event);
    },
    generateSheetSupplementary() {
      return this.download.apply(this, [true]);
    },
    generateSheet() {
      return this.download.apply(this);
    }
  }
});
