import Ember from 'ember';

export default Ember.Mixin.create({
  send: function(actionName) {
    var args = [].slice.call(arguments, 1);

    // support {{action notAString}}
    if (actionName && actionName.perform) {
      return actionName.perform.apply(actionName, args);
    }

    var method = this.get(actionName);

    // support {{action 'aString'}}
    if (method && method.perform) {
      return method.perform.apply(method, args);
    }

    var target;

    if (this._actions && this._actions[actionName]) {
      if (this._actions[actionName].apply(this, args) === true) {
        // handler returned true, so this action will bubble
      } else {
        return;
      }
    }

    if (target = Ember.get(this, 'target')) {
      Ember.assert("The `target` for " + this + " (" + target + ") does not have a `send` method", typeof target.send === 'function');
      target.send.apply(target, arguments);
    }
  }
});

