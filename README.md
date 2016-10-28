redux-bike-router
=================

[![npm version](https://badge.fury.io/js/redux-bike-router.svg)](https://badge.fury.io/js/redux-bike-router)
[![dependencies](https://david-dm.org/accurat/redux-bike-router/status.svg)](https://david-dm.org/accurat/redux-bike-router)
[![devDependencies](https://david-dm.org/accurat/redux-bike-router/dev-status.svg)](https://david-dm.org/accurat/redux-bike-router?type=dev)
[![peerDependencies](https://david-dm.org/accurat/redux-bike-router/peer-status.svg)](https://david-dm.org/accurat/redux-bike-router?type=peer)
<!-- [![build status](https://travis-ci.org/accurat/redux-bike-router.svg?branch=master)](https://travis-ci.org/accurat/redux-bike-router) -->

[![NPM](https://nodei.co/npm/redux-bike-router.png)](https://npmjs.org/package/redux-bike-router)

## ⚠️💥 EXPERIMENTAL 💥⚠️

A tiny router implementation designed specifically for Redux, as simple as a :bike:!
Reactive to state changes, uses store selectors to build an URL and dispatches actions to
modify the state from the URL.

## The Idea

At [Accurat](http://accurat.it/) we always found `react-router`, the de-facto standard for React applications,
**not to work well** with the global state that is used in Redux applications.

Its design make it difficult to implement in a later step of the kickstart of the application, and
doesn't use the `state` forcing you to use `withRouter()` around the `connect()` of your component.
This forces you to redesign a lot of your code for every small routing change, because
your components are now tightly coupled to the routing solution.

This very simple middleware uses the pre-existing `state` of your application to generate the URL and
keeping it updated, following a very simple configuration that has a similar pattern to the familiar
`react-redux`'s `connect()`.

Because your components will be decoupled from everything routing-related:

- It can be added whenever you want in the lifetime of the project.
- The routing logic can be changed without touching any component (a new routing parameter can be added with no more than 4 lines!)
- Plays well (or it should) with `redux-saga` and any other redux middleware.
- Is completely agnostic from the URL-parsing mechanism, choose your preferred mini-lib or use a Poor Old Regex.

## Install

```sh
npm install --save redux-bike-router
```

## Documentation

The API is merely:

### `createRoutingMiddleware({ urlConfig, subStateToUrl, urlToSegments, pageSelector })`
Creates a Redux routing middleware. The main pieces the middleware needs from you are:

#### `urlConfig: Object`
An Object with a *selector* and an *action* for every URL segment.

#### `subStateToUrl: (subState: Object) => String | Array<String>`
Takes the right pieces of State, should return an URL String or an Array of URL segments.

#### `urlToSegments: (url: String) => Object`
Takes the URL String, should parse it and return an Object of URL segments.

#### `pageSelector: (state: any) => String`
It's a normal State selector: takes the entire State, should return a String representing the current page.
<br/>The page is used primarily for back/forward browser-navigation.
<br/>It's useful to use `applyUrlSelectors` in here, to select parts of the State listed in `urlConfig`. (See below)

## Quick start

```js
import { createStore, applyMiddleware } from 'redux'
import createRoutingMiddleware, { applyUrlSelectors } from 'redux-bike-router'

const urlConfig = {
  taskId: {
    selector: state => state.taskId,
    action: taskId => ({ type: 'CHANGE_TASK', payload: taskId }),
  },
}

function subStateToUrl(subState) {
  const { taskId } = subState
  if (taskId === null) return '/'
  return [taskId]
}

function urlToSegments(url) {
  const URL_RE = /^\/(?:(\d+)\/)?$/
  const urlMatches = url.match(URL_RE)
  if (urlMatches === null) return null
  const [taskId = null] = urlMatches.slice(1)
  return { taskId: taskId === null ? null : parseInt(taskId, 10) }
}

export function pageSelector(state) {
  const { taskId } = applyUrlSelectors(state, urlConfig)
  if (taskId === null) return 'home'
  if (taskId !== null) return 'task'
}

const routingMiddleware = createRoutingMiddleware({ urlConfig, pageSelector, subStateToUrl, urlToSegments })

export const store = createStore(reducer, applyMiddleware(routingMiddleware))
```

Then use `store` and `pageSelector` in your app!

See the [example](https://github.com/accurat/redux-bike-router/tree/master/example) for further details.

## Used in

- [worldpotus.com](http://www.worldpotus.com/), [opensourced here](https://github.com/GoogleTrends/world-potus)

## TODO

0. Improve example.
0. Batch dispatches in `dispatchUrlActionsOnLocation` to prevent renders in between actions, thay could cause inconsistent state.
   See [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) for approaches.
0. Check for user errors and display useful warnings. Maybe check for URL consistency for every action in development.

## Contributions, ideas, comments

Are very welcome, please open an issue or a PR.
The code is actually very simple!
