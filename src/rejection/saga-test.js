import { takeEvery, call, put, select } from "redux-saga/effects";
import { describe } from "riteway";
import { getState, pageStateLoaded } from "./rejection-reducer";

import {
  getFromLocalStorage,
  handleGetFromLocalStorage,
  watchGetFromLocalStorage,
  loadLocalStorage,
  watchSave,
  handleSave,
  saveToLocalStorage,
  watchSavePattern,
} from "./sagas";

const createState = () => ({
  fakeState: true,
});

describe("watchGetFromLocalStorage", async (assert) => {
  const iter = watchGetFromLocalStorage();

  assert({
    given: "getFromLocalStorage action",
    should: "handle the getFromLocalStorage action",
    actual: iter.next().value,
    expected: takeEvery(getFromLocalStorage.type, handleGetFromLocalStorage),
  });
});

describe("handleGetFromLocalStorage", async (assert) => {
  {
    const iter = handleGetFromLocalStorage();

    assert({
      given: "no arguments",
      should: "trigger the load from localStorage",
      actual: iter.next().value,
      expected: call(loadLocalStorage),
    });
  }
  {
    const iter = handleGetFromLocalStorage();
    iter.next();
    const state = createState();

    assert({
      given: "no arguments, first next() called",
      should: "dispatch the pageStateLoaded action",
      actual: iter.next(state).value,
      expected: put(pageStateLoaded(state)),
    });
  }
});

describe("watchSave", async (assert) => {
  const iter = watchSave();

  assert({
    given: "no arguments",
    should: "handle all save actions",
    actual: iter.next().value,
    expected: takeEvery(watchSavePattern, handleSave),
  });
});

describe("handleSave", async (assert) => {
  {
    const iter = handleSave();

    assert({
      given: "no arguments",
      should: "trigger the save to localStorage",
      actual: iter.next().value,
      expected: select(getState),
    });
  }

  {
    const iter = handleSave();
    iter.next();
    const state = createState();

    assert({
      given: "no arguments, first next() called",
      should: "create a call object for saveToLocalStorage",
      actual: iter.next(state).value,
      expected: call(saveToLocalStorage, state),
    });
  }
});
