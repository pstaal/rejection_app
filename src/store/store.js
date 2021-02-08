import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createWrapper } from "next-redux-wrapper";
import { logger } from "redux-logger";

import reducer from "./root-reducer.js";
import { rootSaga } from "../rejection/sagas.js";

const devMode = process.env.NODE_ENV === `development`;

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  (process.browser &&
    typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const middlewares = [sagaMiddleware];

if (devMode) {
  middlewares.push(logger);
}

export const makeStore = () => {
  const store = createStore(
    reducer,
    reducer(),
    composeEnhancers(applyMiddleware(...middlewares))
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });
