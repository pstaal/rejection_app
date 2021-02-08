import { describe } from "riteway";
import match from "riteway/match";

import {
  reducer,
  addQuestion,
  deleteQuestion,
  getScore,
  getQuestions,
  slice,
  editQuestion,
  pageStateLoaded,
  getState,
} from "./rejection-reducer";

const createState = ({ questions = [] } = {}) => questions;
const createSampleQuestions = () => [
  {
    id: 1,
    timestamp: 2,
    question: "Can you help?",
    askee: "Peter",
    status: "unanswered",
  },
  {
    id: 2,
    timestamp: 8,
    question: "What time is it?",
    askee: "John",
    status: "unanswered",
  },
  {
    id: 3,
    timestamp: 4,
    question: "Do you have a bottle?",
    askee: "Richard",
    status: "accepted",
  },
];

const withSlice = (state) => ({
  [slice]: state,
});

describe("rejection reducer", async (assert) => {
  assert({
    given: "no arguments",
    should: "return a valid initital state",
    actual: reducer(),
    expected: createState(),
  });
});

describe("rejection reducer", async (assert) => {
  {
    const question = {
      id: 1,
      timestamp: 2,
      question: "Can you help?",
      askee: "Peter",
      status: "unanswered",
    };

    assert({
      given: "an action object for a new question",
      should: "return a new state with the new question",
      actual: reducer(reducer(), addQuestion(question)),
      expected: createState({ questions: [question] }),
    });
  }

  {
    const includes = match(addQuestion().payload.id);
    assert({
      given: "no id",
      should: "generate an id",
      actual: includes("c"),
      expected: "c",
    });
  }
  {
    assert({
      given: "no timestamp",
      should: "generate a timestamp",
      actual: Boolean(addQuestion().payload.timestamp),
      expected: true,
    });
  }
});

describe("rejection reducer get score", async (assert) => {
  const actions = [
    addQuestion({ status: "rejected" }),
    addQuestion({ status: "rejected" }),
    addQuestion({ status: "accepted" }),
  ];
  const state = withSlice(actions.reduce(reducer, reducer()));

  assert({
    given: "some state with questions in it",
    should: "return the correct score",
    actual: getScore(state),
    expected: 21,
  });
});

describe("rejection/getQuestions", async (assert) => {
  const questionsArr = ["question 1", "question 2", "question 3"];
  const actions = questionsArr.map((question) => addQuestion({ question }));

  const state = withSlice(actions.reduce(reducer, reducer()));
  const selection = getQuestions(state);
  const actual = selection.map(({ question }) => question);

  assert({
    given: "state with questions in it",
    should: "return the questions as an array",
    actual,
    expected: questionsArr,
  });
});

describe("rejection reducer edit question", async (assert) => {
  const question = {
    id: 1,
    timestamp: 2,
    question: "Can you help?",
    askee: "Peter",
    status: "unanswered",
  };

  assert({
    given: "a edited question",
    should: "return the edited question",
    actual: editQuestion(question).payload,
    expected: question,
  });
});

describe("rejection/editQuestion", async (assert) => {
  const state = createState({
    questions: [
      {
        id: 1,
        timestamp: 2,
        question: "Can you help?",
        askee: "Peter",
        status: "unanswered",
      },
      {
        id: 2,
        timestamp: 8,
        question: "What time is it?",
        askee: "John",
        status: "unanswered",
      },
      {
        id: 3,
        timestamp: 4,
        question: "Do you have a bottle?",
        askee: "Richard",
        status: "accepted",
      },
    ],
  });

  const newQuestion = {
    id: 1,
    timestamp: 2,
    question: "Can you help?",
    askee: "Peter",
    status: "accepted",
  };

  const action = editQuestion(newQuestion);

  assert({
    given: "An edited question",
    should: "return the new list of questions with the edited one",
    actual: reducer(state, action),
    expected: [
      {
        id: 1,
        timestamp: 2,
        question: "Can you help?",
        askee: "Peter",
        status: "accepted",
      },
      {
        id: 2,
        timestamp: 8,
        question: "What time is it?",
        askee: "John",
        status: "unanswered",
      },
      {
        id: 3,
        timestamp: 4,
        question: "Do you have a bottle?",
        askee: "Richard",
        status: "accepted",
      },
    ],
  });
});

describe("rejection/deleteQuestion", async (assert) => {
  const q1 = {
    id: 1,
    timestamp: 2,
    question: "Can you help?",
    askee: "Peter",
    status: "unanswered",
  };
  const q3 = {
    id: 3,
    timestamp: 4,
    question: "Do you have a bottle?",
    askee: "Richard",
    status: "accepted",
  };
  const state = createState({
    questions: [
      q1,
      {
        id: 2,
        timestamp: 8,
        question: "What time is it?",
        askee: "John",
        status: "unanswered",
      },
      q3,
    ],
  });

  // This test could be made less brittle if we use a selector for the state check in the actual value
  assert({
    given: "some questions in state and an id",
    should: "delete the question with the corresponding id",
    actual: reducer(state, deleteQuestion({ id: 2 })),
    expected: createState({ questions: [q1, q3] }),
  });
});

describe("rejection/pageStateLoaded", async (assert) => {
  const loadedState = createState({
    questions: createSampleQuestions(),
  });
  const newState = withSlice(reducer(reducer(), pageStateLoaded(loadedState)));

  assert({
    given: "some loaded state",
    should: "add to the reducer state",
    actual: getState(newState),
    expected: loadedState,
  });
});
