redux-bike-router
=================

## ⚠️💥 EXPERIMENTAL 💥⚠️

A very tiny router implementation designed specifically for Redux.
Reactive to state changes, uses store selectors to build an URL and dispatches actions to
modify the state from the URL.

## Quick start

```js
import { createStore, applyMiddleware } from 'redux'
import createRoutingMiddleware from 'redux-bike-router'

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
  const { taskId } = state
  if (taskId === null) return 'home'
  if (taskId !== null) return 'task'
}

const routingMiddleware = createRoutingMiddleware({ urlConfig, pageSelector, subStateToUrl, urlToSegments })

export const store = createStore(reducer, applyMiddleware(routingMiddleware))

// Then use store and pageSelector in your app!
```

## Contributions, ideas, comments

Are very welcome, please open an issue or a PR.
The code is actually very simple!
