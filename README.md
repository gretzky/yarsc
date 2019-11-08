# yarsc

yet another react state container. now in 65 lines or less!

## usage

```
yarn add yarsc
```

YARSC is a state container built in only React APIs. It's been done a million times but whatever.

This state container provides out of the box support for thunks and has a very minimal logger when you're in dev mode (web or native).

Use `<Provider />` to initialize the state context. Pass it a root reducer and an initial state and you're good to know. 

You can use the `useStateContext()` helper to grab `state` and `dispatch`.


## full example

```jsx
import React from 'react'
import Provider, { useStateContext } from 'yarsc'
import nhlApi from '@nhl-api/client'

const teamsAction = () => async dispatch => {
  try {
    const response = await nhlApi.getTeams().then(data => dispatch({ type: "TEAMS", payload: data }))
    return Promise.resolve(response)
  } catch (err) {
    console.error(err)
  }
}

const teamsState = {
  teams: []
}

function teamsReducer = (state = teamsState, action) => {
  switch (action.type) {
    case "TEAMS":
      return {
        ...state,
        teams: action.payload
      }
    default:
      return state
  }
}

const fooAction = () => ({
  type: "FOO",
  payload: 2
})

const fooState = {
  foo: 1
}

function fooReducer = (state = fooState, action) => {
  switch (action.types) {
    case "FOO":
      return {
        ..state,
        foo: action.payload
      }
    default:
      return state
  }
}

const rootReducer = ({ teamsState, fooState }, action) => ({
  teams: teamsReducer(teamsState, action),
  foo: fooReducer(fooState, action)
})

const initialState = {
  teams: teamsState,
  foo: fooState
}

const App = () => {
  const { state, dispatch } = useSessionContext()

  React.useEffect(() => {
    dispatch(teamsAction())
  }, [])

  return (
    <div>
      <h1>{state.foo}</h1>
      <ul>
        <li>
          {state.teams ? state.teams.map(team => team.name)} : null}
        </li>
      </ul>
    </div>
  )
}

const Root = () => (
  <Provider reducer={rootReducer} initialState={initialState}>
    <App />
  </Provider>
)
```


---
built with [skeletor](https://github.com/gretzky/skeletor) 💀
