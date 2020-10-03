import Ember from 'ember';
import { dateformat } from '../helpers/dateformat';

export default Ember.Controller.extend({
  subMenu: [
    {
      route: 'evaluator.to-fix',
      description: 'Javítandók'
    }, {
      route: 'evaluator.booked',
      description: 'Javítás és javítottak'
    }
  ],


  store: Ember.inject.service(),
  session: Ember.inject.service('session'),

  filteredDeliverablesSelect: [],
  headerGrading: [
    'Neptun',
    'Név',
    'Feltöltés ideje',
    'Határidő',
    'Javító',
    'Feladatkód',
    'Labor kód',
    'Beadandó típusa',
    'Kijavítva',
    'Érdemjegy',
    'IMSc'
  ],
  rowIndeciesGrading: [
    'Event.StudentRegistration.User.neptun',
    'Event.StudentRegistration.User.displayName',
    'uploadedAt',
    'deadlineFormatted',
    'CorrectorName',
    'Event.ExerciseSheet.ExerciseType.shortName',
    'DeliverableTemplate.EventTemplate.ExerciseCategory.type',
    'DeliverableTemplate.description',
    'finalized',
    'grade',
    'imsc'
  ],

  page: 0,
  filteredDeliverables: [],

  actions: {

    resetPage() {
      this.set('page', 0);
      this.set('filteredDeliverablesSelect', []);
      this.set('filteredDeliverables', []);
      this.actions.loadFilteredDeliverablesForGrading.apply(this);
      return false;
    },

    book() {
      this.set('success', false);
      this.set('error', '');
      this.set('selectedDeliverable.Corrector', this.get('model.user'));
      this.set('selectedDeliverable.grading', true);
      this.get('selectedDeliverable').save().then(() => {
        this.set('success', true);
      }, (t) => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          this.set('error', t.errors[0].title);
        }
      });
      return false;
    },
    unbook() {
      this.set('success', false);
      this.set('error', '');
      this.set('selectedDeliverable.Corrector', null);
      this.set('selectedDeliverable.grading', false);
      this.get('selectedDeliverable').save().then(() => {
        this.set('success', true);
      }, (t) => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          this.set('error', t.errors[0].title);
        }
      });
      return false;
    },
    save(finalized = true) {
      this.set('success', false);
      this.set('error', '');
      if (this.get('selectedDeliverable.comment') === '') {
        this.set('selectedDeliverable.comment', null);
      }
      if (this.get('selectedDeliverable.grade') === '') {
        this.set('selectedDeliverable.grade', null);
      }
      if (this.get('selectedDeliverable.imsc') === '') {
        this.set('selectedDeliverable.imsc', null);
      }
      if (this.get('selectedDeliverable.grade') === null) {
        if (finalized) {
          this.set('error', 'No grade provided.');
          return;
        }
      }
      if (this.get('selectedDeliverable.comment') === null) {
        if (finalized) {
          this.set('error', 'No comment provided.');
          return;
        }
      }
      this.set('selectedDeliverable.finalized', finalized);
      this.get('selectedDeliverable').save().then(() => {
        this.set('success', true);
      }, (t) => {
        if (t.errors && t.errors.length > 0 && t.errors[0].title) {
          this.set('error', t.errors[0].title);
        }
      });
      return false;
    },
    back() {
      if (this.get('selectedDeliverable')) {
        const selectedDeliverable = this.get('selectedDeliverable');
        selectedDeliverable.rollbackAttributes();
        const selectedDeliverableId = selectedDeliverable.get('id');
        if (selectedDeliverable.get('grading')) {
          this.set('filteredDeliverablesSelect', this.get('filteredDeliverablesSelect').filter(x => (x.get('id') !== selectedDeliverableId)));
        }
        return this.set('selectedDeliverable', null);
      }
      this.set('success', false);
      this.set('error', '');
      return false;
    },
    changeDeliverableFilter(selected) {
      // reset page if the filter is changed
      this.set('selectedDeliverableFilter', selected);
      this.actions.resetPage.apply(this);
    },
    loadFilteredDeliverablesForGrading() {
      const filter = this.get('selectedDeliverableFilter.filter');
      // filter for event template
      if (this.get('selectedEventTemplate')) {
        filter.eventTemplateId = this.get('selectedEventTemplate.id');
      }
      const pageSize = 50;
      this.get('store').query('deliverable', {
        filter: filter,
        offset: pageSize * this.get('page'),
        limit: pageSize
      }).then(deliverables => {
        deliverables.forEach(x => {
          x.set('uploadedAt', x.get('uploaded') ? dateformat([x.get('lastSubmittedDate')]) : 'No');
          x.set('deadlineFormatted', dateformat([x.get('deadline')]));
        });
        this.set('filteredDeliverables', [
          ...this.get('filteredDeliverables'),
          ...deliverables.map(x => x)
        ]);
        this.set('page', this.get('page') + 1);
      });
      return false;
    },
    backFromGrading() {
      this.set('selectedEvent', null);
      this.set('selectedEventUser', null);
      this.set('selectedEventDemonstrator', null);
      const selectedDeliverable = this.get('selectedDeliverable');
      if (selectedDeliverable) {
        selectedDeliverable.rollbackAttributes();
        const selectedDeliverableId = selectedDeliverable.get('id');
        this.set('filteredDeliverablesSelect', this.get('filteredDeliverablesSelect').map(x => (
          (x.get('id') === selectedDeliverableId) ? selectedDeliverable : x
        )));
      }
      this.set('selectedDeliverable', null);
      this.set('success', false);
      this.set('error', '');
      return false;
    },
    download() {
      const form = document.createElement('form');
      form.setAttribute('target', '_blank');
      form.setAttribute('method', 'post');
      form.setAttribute('action', this.get('selectedDeliverable.downloadLink'));
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'token');
      hiddenInput.setAttribute('value', this.get('session.data.authenticated.token'));
      form.appendChild(hiddenInput);
      document.body.appendChild(form);
      form.submit();
      form.remove();
      return false;
    }
  }
});
