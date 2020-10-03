import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('change-group');
  this.route('demonstrator', function() {
    this.route('detail', { path: "/:eventTemplateId" }, function() {
      this.route('event', { path: "/event/:eventId" });
    });
  });
  this.route('directory', function() {
    this.route('new');
    this.route('list', function() {
      this.route('detail', { path: "/:id" });
    });
  });
  this.route('entry-test');
  this.route('error');
  this.route('evaluator', function() {
    this.route('to-fix', function() {
      this.route('deliverable', { path: "/:id" });
    });
    this.route('booked', function() {
      this.route('deliverable', { path: "/:id" });
      this.route('no-deliverable');
    });
  });
  this.route('event-templates');
  this.route('login');
  this.route('login-shibboleth');
  this.route('logout');
  this.route('news');
  this.route('notification');
  this.route('permission-denied');
  this.route('semester');
  this.route('settings');
  this.route('sql');
  this.route('statistics');
  this.route('student');
});

export default Router;
