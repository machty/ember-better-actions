import Ember from 'ember';
import action from 'better-actions/action';

import BetterActionHandler from 'better-actions/handler-mixin';

export default Ember.Controller.extend(BetterActionHandler, {

  needs: ['global-modal'],

  submitForm: action(function() {
    // simulate slow ajax
    var shouldFail = this.get('shouldFail');
    return new Ember.RSVP.Promise(function(fulfill, reject) {
      if (shouldFail) {
        Ember.run.later(reject, 1500);
      } else {
        Ember.run.later(fulfill, 1500);
      }
    });
  }),

  doSomeGlobalModalThing: action(function() {
    // TODO: kinda really weird to have to `get`
    // yourself as an action...
    var selfAction = this.get('doSomeGlobalModalThing');
    this.set('controllers.global-modal.currentAction', selfAction);

    return new Ember.RSVP.Promise(function(f) {
      Ember.run.later(f, 1500);
    });
  }),

  shouldFail: false,

  submitText: Ember.computed('submitForm.state', function() {
    switch(this.get('submitForm.state')) {
      case "pending":
        return "Submitting...";
      case "rejected":
        return "Try Again";
      case "fulfilled":
        return "Submit Again";
      default:
        return "Submit";
    }
  })
});

