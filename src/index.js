export default function reduxFlatPromiseMiddleware(initialExtraArg = null) {
  return function (dispatch, getState, extraArg = initialExtraArg) {
    return next => (action) => {
      if (typeof action === 'function') {
        return next(action);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;

      next({ ...rest, type: REQUEST });

      const actionPromise = promise({ dispatch, getState, extraArg });

      actionPromise
        .then(
          result => next({ ...rest, payload: result, type: SUCCESS }),
          error => next({ ...rest, payload: error, type: FAILURE }),
        )
        .catch((error) => {
          next({ ...rest, payload: error, type: FAILURE });
        });

      return actionPromise;
    };
  };
}
