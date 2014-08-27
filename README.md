# Better-actions

ember-cli addon for the better actions concept I've been working on,
outline by [this RFC](https://github.com/emberjs/rfcs/pull/2)

[Demo](https://machty.s3.amazonaws.com/ember/better-actions/index.html)

## Usage

If you want to try this out in your project, I think all you need to do
is `npm install better-actions --save-dev`.

That'll give you access to

    import action from 'better-actions/action';
    import BetterActionHandler from 'better-actions/handler-mixin';

`action` is a function that you can wrap your action handling functions
in (see the `controllers/application.js` in the dummy app code in this
repo). `BetterActionHandler` is a mixin you can mix into your
controllers or components. If you wanted to apply it to everything
(risky for a prod app), then I think you could do
`Ember.ActionHandler.reopen(BetterActionHandler)`, which just overwrites
the `send` method to be Better Action-aware.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
