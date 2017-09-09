import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  header: ['Neptun', 'Category', 'Deliverable'],
  rowIndecies: ['neptun', 'exerciseCategoryName', 'deliverableTemplateName'],
  filteredDeliverablesSelect: [],
  headerGrading: ['Type', 'Neptun', 'Name', 'Finalized', 'Grade'],
  rowIndeciesGrading: ['DeliverableTemplate.description', 'Student.neptun', 'Student.displayName', 'finalized', 'grade'],
  didReceiveAttrs() {
    this.set('selectedEventTemplate', null);
    this.set('selectedDeliverableTemplate', null);
    return this.set('currentView', null);
  },
  subMenu: [
    {
      key: 'select',
      description: 'Select for grading'
    }, {
      key: 'grading',
      description: 'Grading'
    }
  ],
  deliverableFilters: [
    {
      filter: {
        isCorrector: true,
        finalized: false,
        hasGrade: false
      },
      value: 'Does not started to correct'
    },
    {
      filter: {
        isCorrector: true,
        finalized: false,
        hasGrade: true
      },
      value: 'Has grade but not finalized'
    },
    {
      filter: {
        isCorrector: true,
        finalized: true,
        hasGrade: true
      },
      value: 'Has grade and finalized'
    }
  ],
  page: 0,
  actions: {
    // changes view
    goToView(key) {
      this.set('currentView', key);
      return false;
    },
    // changes event template in the filter
    changeEventTemplate(eT) {
      this.set('selectedEventTemplate', eT);
      this.set('selectedDeliverableTemplate', '');
      this.actions.resetPage.apply(this);
      return false;
    },
    // changes deliverable template in the filter
    changeDeliverableTemplate(dT) {
      this.set('selectedDeliverableTemplate', dT);
      this.actions.resetPage.apply(this);
      return false;
    },
    // load deliverables by filter
    loadFilteredDeliverablesForSelect() {
      const filter = {
        isFree: true,
        isAttached: true,
        isOver: true,
        isFile: true
      };
      if (this.get('selectedEventTemplate')) {
        filter.eventTemplateId = this.get('selectedEventTemplate.id');
      }
      if (this.get('selectedDeliverableTemplate')) {
        filter.deliverableTemplateId = this.get('selectedDeliverableTemplate.id');
      }
      const pageSize = 10;
      this.get('store').query('deliverable', {
        filter: filter,
        offset: pageSize * this.get('page'),
        limit: pageSize
      }).then(deliverables => {
        this.set('filteredDeliverablesSelect', [
          ...this.get('filteredDeliverablesSelect'),
          ...deliverables.map(x => {
            return ({
              id: x.get('id'),
              exerciseCategoryName: x.get('DeliverableTemplate.EventTemplate.ExerciseCategory.type'),
              deliverableTemplateName: x.get('DeliverableTemplate.description'),
              neptun: x.get('Student.neptun'),
              meta: x
            });
          })
        ]);
        this.set('page', this.get('page') + 1);
      });
      return false;
    },
    // resetPage
    resetPage() {
      this.set('page', 0);
      this.set('filteredDeliverablesSelect', []);
      this.actions.loadFilteredDeliverablesForSelect.apply(this);
      return false;
    },
    changeDeliverableFromGrading({ meta: deliverable }) {
      console.log(deliverable.get('Event')); 
      deliverable.get('Event').then(event => {
        console.log(event);
        this.set('selectedEvent', event);
        this.set('selectedEventUser', deliverable.get('Student'));
        this.set('success', false);
        this.set('error', '');
        this.set('selectedDeliverable', deliverable);
        this.set('selectedDeliverable.gradingCache', this.get('selectedDeliverable.grading'));
      });
      return false;
    },
    toggleFinalized() {
      this.toggleProperty('selectedDeliverable.finalized');
      return false;
    },
    toggleGrading() {
      this.toggleProperty('selectedDeliverable.gradingCache');
      return false;
    },
    save() {
      this.set('success', false);
      this.set('error', '');
      if (this.get('selectedDeliverable.gradingCache')) {
        this.set('selectedDeliverable.Corrector', this.get('model.user'));
      } else {
        this.set('selectedDeliverable.Corrector', null);
      }
      if (this.get('selectedDeliverable.comment') === '') {
        this.set('selectedDeliverable.comment', null);
      }
      if (this.get('selectedDeliverable.grade') === '') {
        this.set('selectedDeliverable.grade', null);
      }
      if (this.get('selectedDeliverable.imsc') === '') {
        this.set('selectedDeliverable.imsc', 0);
      }
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
        this.get('selectedDeliverable').rollbackAttributes();
        return this.set('selectedDeliverable', null);
      }
    },
    changeDeliverableFilter(selected) {
      this.set('selectedDeliverableFilter', selected);
      this.get('store').query('deliverable', {
        filter: selected.filter
      }).then(deliverables => {
        this.set('filteredDeliverables', deliverables);
      });
      return false;
    },
    backFromGrading() {
      this.set('selectedEvent', null);
      this.set('selectedEventUser', null);
      this.set('selectedDeliverable', null);
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
