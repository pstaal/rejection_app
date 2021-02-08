import cuid from "cuid";

export const slice = "rejection";

const addQuestion = ({
  id = cuid(),
  timestamp = Date.now(),
  askee = "",
  question = "",
  status = "",
} = {}) => ({
  type: addQuestion.type,
  payload: {
    id,
    timestamp,
    askee,
    question,
    status,
  },
});
addQuestion.type = "rejection/addQuestion";

const editQuestion = ({
  id = cuid(),
  timestamp = Date.now(),
  askee = "",
  question = "",
  status = "",
} = {}) => ({
  type: editQuestion.type,
  payload: {
    id,
    timestamp,
    askee,
    question,
    status,
  },
});
editQuestion.type = "rejection/editQuestion";

const deleteQuestion = ({ id } = {}) => ({
  type: deleteQuestion.type,
  payload: {
    id,
  },
});
deleteQuestion.type = "rejection/deleteQuestion";

const pageStateLoaded = (loadedState) => ({
  type: pageStateLoaded.type,
  payload: loadedState,
});
pageStateLoaded.type = "rejection/pageStateLoaded";

const reducer = (state = [], { type, payload } = {}) => {
  switch (type) {
    case addQuestion.type:
      return [...state, payload];
    case editQuestion.type:
      return state.map((question) => {
        if (payload.id === question.id) {
          return payload;
        }
        return question;
      });
    case deleteQuestion.type:
      return state.filter((question) => {
        return question.id !== payload.id;
      });
    case pageStateLoaded.type:
      return payload || state;
    default:
      return state;
  }
};

const getScore = (state) =>
  state[slice].reduce(
    (score, { status }) =>
      status === "rejected"
        ? score + 10
        : status === "accepted"
        ? score + 1
        : score,
    0
  );

const getQuestions = (state) => state[slice];

// selector function for state
// this is a different function name
// because it's used for different things
// and the implementation could diverge in the future.
const getState = (state) => state[slice];

export {
  reducer,
  addQuestion,
  getScore,
  getQuestions,
  getState,
  editQuestion,
  deleteQuestion,
  pageStateLoaded,
};
