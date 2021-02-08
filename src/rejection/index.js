import { connect } from "react-redux";

import {
  getQuestions,
  addQuestion,
  getScore,
  editQuestion,
  deleteQuestion,
} from "./rejection-reducer";

import { getFromLocalStorage } from "./sagas";

import Rejection from "./rejection-component";

const mapStateToProps = (state) => ({
  questions: getQuestions(state),
  score: getScore(state).toString(),
});

const mapDispatchToProps = {
  addQuestion,
  editQuestion,
  deleteQuestion,
  getFromLocalStorage,
};

const RejectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Rejection);

export default RejectionContainer;
