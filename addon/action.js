import Ember from 'ember';

var Action = Ember.Object.extend({
  fn: null,
  context: null,
  promise: null,
  pending:   false,
  resolved:  false,
  rejected:  false,
  fulfilled: false,
  state: 'default',
  args: null,

  inactive: true,

  // need a mechanism to support when
  // action is disabled

  perform: function() {
    if (this.get('disabled')) {
      return;
    }
    // TODO: unify the above and below?
    if (this.get('pending')) {
      return;
    }

    var self = this;
    var args = [].slice.call(arguments);
    var promise = Ember.RSVP.resolve().then(function() {
      return self.fn.apply(self.context, args);
    });
    return this.setupPromise(promise, args);
  },

  reset: function() {
    this.setProperties({
      pending: false,
      resolved: false,
      rejected: false,
      fulfilled: false,
      state: 'default',
      inactive: true,
      promise: null,
      args: null,
      value: null
    });
  },

  // TODO: megahax to support {{submitForm.resetAction}}
  createResetAction: function() {
    var self = this;
    this.resetAction = {
      perform: function() {
        self.reset();
      }
    };
  }.on('init'),

  // pending is only true while promise is a non-null, unresolved promise
  setupPromise: function(promise, args) {
    this.reset();
    this.setProperties({
      state: 'pending',
      pending: true,
      inactive: false,
      promise: promise,
      args: args[0] // expect first arg to be obj
    });

    var self = this;
    function setProperties(values) {
      if (self.get('promise') === promise) {
        self.setProperties(values);
      }
    }

    return promise.then(function(v) {
      setProperties({
        fulfilled: { value: v },
        value: v,
        state: 'fulfilled',
        resolved: true,
        pending: false
      });
      return v;
    }).catch(function(e) {
      setProperties({
        rejected: { value: e },
        value: e,
        state: 'rejected',
        resolved: true,
        pending: false
      });
      return Ember.RSVP.reject(e);
    });
  }
});

export default function action(_fn) {
  var fn = _fn || Ember.K;
  var configOptions = {};
  var cp = Ember.computed(function() {
    var attrs = {
      fn: fn,
      context: this,

      // overridable stuff
      disabled: false
    };
    Ember.merge(attrs, configOptions);
    return Action.createWithMixins(attrs);
  });

  cp.configure = function(options) {
    for (var k in options) {
      if (!options.hasOwnProperty(k)) { continue; }
      var value = options[k];
      if (value instanceof Ember.ComputedProperty) {
        configOptions[k] = recontextualizeCp(value);
      } else {
        configOptions[k] = value;
      }
    }
    return cp;
  };

  return cp;
}

function recontextualizeCp(cp) {
  var fn = cp.func;
  var args = cp._dependentKeys.map(function(depKey) {
    return "context." + depKey;
  });
  args.push(function(key) {
    return fn.call(this.get('context'), key);
  });
  return Ember.computed.apply(null, args);
}

