import { call, put, takeEvery, fork, all, select } from "redux-saga/effects";
import { pageStateLoaded, getState } from "./rejection-reducer";

// This gets dispatched when the page loads.
const getFromLocalStorage = () => ({
  type: getFromLocalStorage.type,
});
getFromLocalStorage.type = "rejection/getFromLocalStorage";

export { getFromLocalStorage };

//save to local storage
const saveToLocalStorage = (state) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem("state", serializedState);
};

//retrieve from local storage
const loadLocalStorage = () => {
  const serializedState = localStorage.getItem("state");
  if (serializedState === null) {
    return undefined;
  }
  return JSON.parse(serializedState);
};

// worker function when a new page loads
// we need to read from localStorage and put an action
// to add the state to the store.
function* handleGetFromLocalStorage() {
  const state = yield call(loadLocalStorage);
  yield put(pageStateLoaded(state));
}

//worker function when a state gets saved to local storage
function* handleSave() {
  const stateToSave = yield select(getState);
  yield call(saveToLocalStorage, stateToSave);
}

const watchSavePattern = ({ type }) => type !== getFromLocalStorage.type;
// Watch function to save to local storage on every action
// this saga doesn't care about other slices, but in the future
// you could add more slices, causing this watcher to dispatch
// save events when it doesn't need to. This is OK for now,
// but you should be aware of it.
function* watchSave() {
  yield takeEvery(watchSavePattern, handleSave);
}

//watch function that watches action when new page loads
function* watchGetFromLocalStorage() {
  yield takeEvery(getFromLocalStorage.type, handleGetFromLocalStorage); //Do we use the string here or the constant we've defined?
}

function* rootSaga() {
  //is this the only function that gets exported?
  yield all([fork(watchSave), fork(watchGetFromLocalStorage)]);
}

export {
  rootSaga,
  watchGetFromLocalStorage,
  handleGetFromLocalStorage,
  loadLocalStorage,
  handleSave,
  watchSave,
  saveToLocalStorage,
  watchSavePattern,
};
