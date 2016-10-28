import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'

import createRoutingMiddleware from 'redux-bike-router'

import logo from './logo.svg'
import './App.css'

function intOrNull(val) { return val === null ? null : parseInt(val, 10) }

const initialState = {
  taskId: null,
  subtaskId: null,
  tasks: [
    { id: 0, text: 'Hello World', parent: null, done: true },
    { id: 1, text: 'Go to the market', parent: null, done: false },
    { id: 2, text: 'Buy bread', parent: 1, done: true },
    { id: 3, text: 'Buy milk', parent: 1, done: false },
  ],
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_TASK':
      return Object.assign({}, state, { taskId: action.payload })
    case 'CHANGE_SUBTASK':
      return Object.assign({}, state, { subtaskId: action.payload })
    default:
      return state
  }
}

const urlConfig = {
  taskId: {
    selector: state => state.taskId,
    action: taskId => ({ type: 'CHANGE_TASK', payload: taskId }),
  },
  subtaskId: {
    selector: state => state.subtaskId,
    action: taskId => ({ type: 'CHANGE_SUBTASK', payload: taskId }),
  },
}

function subStateToUrl(subState) {
  const { taskId, subtaskId } = subState
  if (subtaskId === null) return [taskId]
  if (subtaskId !== null) return [taskId, subtaskId]
  if (taskId === null) return '/'
}

function urlToSegments(url) {
  const URL_RE = /^\/(?:(\d+)\/(?:(\d+))?)?\/?$/
  const urlMatches = url.match(URL_RE)
  if (urlMatches === null) return null
  const [taskId = null, subtaskId = null] = urlMatches.slice(1)
  console.log('urlToSegments', { taskId: intOrNull(taskId), subtaskId: intOrNull(subtaskId) })
  return { taskId: intOrNull(taskId), subtaskId: intOrNull(subtaskId) }
}

function pageSelector(state) {
  const { taskId, subtaskId } = state
  if (taskId !== null && subtaskId !== null) {
    return 'subtask'
  }
  if (taskId !== null && subtaskId === null) {
    return 'task'
  }
  if (taskId === null && subtaskId === null) {
    return 'home'
  }
  console.error(state)
  throw new Error('pageSelector: inconsistent state')
}

const routingMiddleware = createRoutingMiddleware({ urlConfig, pageSelector, subStateToUrl, urlToSegments })
const logMiddleware = store => next => action => {
  console.info('Action', action)
  const result = next(action)
  console.info('State:', store.getState())
  return result
}
const store = createStore(reducer, applyMiddleware(logMiddleware, routingMiddleware))

/**
 * App & Components
 */

// eslint-disable-next-line react/prop-types
function Container({ title, children }) {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Welcome to <em>Bike</em> Router!</h3>
      </div>
      <div className="App-intro">
        {children}
      </div>
    </div>
  )
}

const provideMainTasks = connect(
  (state) => ({ tasks: state.tasks.filter(task => task.parent === null) }),
  (dispatch) => ({ onSelectTask: (taskId) => dispatch({ type: 'CHANGE_TASK', payload: taskId }) }),
)
const Home = provideMainTasks(({ tasks = [], onSelectTask }) => {
  return (
    <Container>
      <h2>Task list:</h2>
      {tasks.map(task =>
        <div key={task.id}
             style={{ cursor: 'pointer', color: task.done ? 'grey' : 'black' }}
             onClick={() => onSelectTask(task.id)}
        >
          {task.text}
        </div>
      )}
    </Container>
  )
})

const provideSubtasks = connect(
  (state) => ({
    task: state.tasks[state.taskId],
    subtasks: state.tasks.filter(task => task.parent === state.taskId),
  }),
  (dispatch) => ({
    onSelectSubtask: (taskId) => { dispatch({ type: 'CHANGE_SUBTASK', payload: taskId }) },
  }),
)
const Task = provideSubtasks(({ task, subtasks, onSelectSubtask }) => {
  return (
    <Container>
      <h2>
        <span>Task: </span>
        {task.text}
      </h2>
      <h3>
        Subtasks:
      </h3>
      {subtasks.map(task =>
        <div key={task.id}
             style={{ cursor: 'pointer', textDecoration: task.done ? 'none' : 'line-through', color: task.done ? 'grey' : 'black' }}
             onClick={() => onSelectSubtask(task.id)}
        >
          {task.text}
        </div>
      )}
    </Container>
  )
})

const provideTaskSubtask = connect(
  (state) => ({
    task: state.tasks[state.taskId],
    subtask: state.tasks[state.subtaskId],
  })
)
const SubTask = provideTaskSubtask(({ task, subtask, onSelectSubtask }) => {
  return (
    <Container>
      <h2>
        <span>Task: </span>
        {task.text}
      </h2>
      <h3>
        <span>Subtask: </span>
        {subtask.text}
      </h3>
    </Container>
  )
})

const providePage = connect((state) => ({ page: pageSelector(state) }))
const Page = providePage(({ page }) => {
  switch (page) {
    case 'home':
      return <Home />
    case 'task':
      return <Task />
    case 'subtask':
      return <SubTask />
    default:
      return <h1>Not Found</h1>
  }
})

export default function App() {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  )
}
