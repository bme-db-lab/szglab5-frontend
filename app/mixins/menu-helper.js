import Ember from 'ember';

export default Ember.Mixin.create({
  menu: {
    STUDENT: [
      {
        key: 'student',
        value: 'Laboratories',
        icon: 'graduation-cap'
      },
      {
        key: 'news',
        value: 'News',
        icon: 'bell-o'
      }
    ],
    ADMIN: [
      {
        key: 'statistics',
        value: "Statisztikák",
        icon: 'bar-chart'
      }, {
        key: 'directory',
        value: "Felhasználók",
        icon: 'users'
      }, {
        key: 'notification',
        value: "Hírek szerkesztése",
        icon: 'bell-o'
      }, {
        key: 'change-group',
        value: "Csoport csere",
        icon: 'dashboard'
      }, /*{
      }, {
        key: 'semester',
        value: "Semesters",
        icon: 'dashboard'
      },*/ {
        key: 'entry-test',
        value: "Beugrókérdések",
        icon: 'pencil'
      }, /*{
        key: 'event-templates',
        value: "Event Templates",
        icon: 'pencil'
      },*/ {
        key: 'sql',
        value: "SQL",
        icon: 'terminal'
      }
    ],
    DEMONSTRATOR: [
      {
        key: 'demonstrator',
        value: "Demonstrátor",
        icon: 'tasks'
      }, {
        key: 'entry-test',
        value: "Beugrókérdések",
        icon: 'pencil'
      }, {
        key: 'change-group',
        value: "Csoport csere",
        icon: 'dashboard'
      }
    ],
    CORRECTOR: [
      {
        key: 'evaluator',
        value: "Javító",
        icon: 'book'
      }
    ]
  }
});
