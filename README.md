# redux-flat-promise-middleware

```js
npm install --save github:j-kish/redux-flat-promise-middleware
```

### Example

```js
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reduxFlatPromiseMiddleware from 'redux-flat-promise-middleware';
import firebase from 'react-native-firebase';
import reducer from './{MY_REDUCER}';

const extraArg = {
  firebase,
};

const store = createStore(
  reducer,
  compose(
    applyMiddleware(
      thunkMiddleware.withExtraArgument(extraArg),
      reduxFlatPromiseMiddleware(extraArg),
    ),
  ),
);
```
```js
const FETCH_USER_REQUEST = '{MyApp}/FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = '{MyApp}/FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = '{MyApp}/FETCH_USER_FAILURE';


export function fetchUser() {
  return {
    types: [FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE],
    promise: ({ extraArg }) => extraArg.firebase.auth().signInAnonymouslyAndRetrieveData(),
  };
}


const initialState = {
  data: {},
  isFetching: false,
  error: null,
  loaded: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        data: {},
        isFetching: true,
        loaded: false,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload.user,
        loaded: true,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
```

Chain
```js
export function fetchUserAndProfile() {
  return function (dispatch) {
    return Promise.resolve()
      .then(() => dispatch(fetchUser()))
      .then(() => dispatch(fetchProfile()))
      .catch((e) => { console.log('fetchUserAndProfile Error: ', e); });
  };
}
```
