import React, { useState, useEffect } from "react";
import { array, bool, func, string, number } from "prop-types";
import { Box, FormField, TextInput, Button } from "grommet";
import { Edit, Trash } from "grommet-icons";

const buttonStyle = {
  margin: "1rem",
};

// Add unit tests to make sure that if
// we pass props, they get rendered correctly
const InputForm = ({
  addQuestion,
  askee: initialAskee = "",
  question: initialQuestion = "",
  id,
  timestamp,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [askee, setAskee] = useState(initialAskee);
  const set = (f) => (e) => f(e.target.value);

  const addQuestionProps = {
    ...(id ? { id } : null),
    ...(timestamp ? { timestamp } : null),
    question,
    askee,
  };

  return (
    <>
      <Box direction="row" pad={{ vertical: "small", horizontal: "medium" }}>
        <Box direction="row" gap="small" className="inputs">
          <div className="question-input-field">
            <FormField label="Question">
              <TextInput
                placeholder="May I have some ice cream?"
                value={question}
                onChange={set(setQuestion)}
              />
            </FormField>
          </div>
          <div className="askee-input-field">
            <FormField label="Askee">
              <TextInput
                placeholder="Bob"
                value={askee}
                onChange={set(setAskee)}
              />
            </FormField>
          </div>
        </Box>
        <Box direction="row">
          <Button
            className="accepted-button"
            fill="horizontal"
            label="Accepted"
            style={buttonStyle}
            onClick={() =>
              addQuestion({ ...addQuestionProps, status: "accepted" })
            }
          />
          <Button
            className="rejected-button"
            fill="horizontal"
            label="Rejected"
            style={buttonStyle}
            onClick={() =>
              addQuestion({ ...addQuestionProps, status: "rejected" })
            }
          />
          <Button
            className="unanswered-button"
            fill="horizontal"
            primary
            label="Unanswered"
            style={buttonStyle}
            onClick={() =>
              addQuestion({ ...addQuestionProps, status: "unanswered" })
            }
          />
        </Box>
      </Box>
      <style jsx>{`
        .buttons {
          width: 10rem;
        }
      `}</style>
    </>
  );
};
InputForm.propTypes = {
  addQuestion: func,
  id: string,
  timestamp: number,
  question: string,
  askee: string,
};

// YAGNI = You Ain't Gonna Need It - since we're not using the id yet, don't pass it.
export const Question = ({
  question,
  askee,
  status,
  id,
  timestamp,
  editQuestion,
  initialEditMode = false,
  deleteQuestion,
}) => {
  const [isEditMode, setEditMode] = useState(initialEditMode);
  const questionProps = {
    question,
    askee,
    status,
    id,
    timestamp,
    addQuestion: (props) => {
      setEditMode(false);
      editQuestion(props);
    },
  };

  const deleteQuestionProps = {
    ...(id ? { id } : null),
  };
  // Dispaly stuff could be factored out so that this in a proper
  // container component. Only container component should care about effects.
  // It's sometimes OK for a single component to do both, but separating them
  // is more flexible (and testable).
  return (
    <>
      {isEditMode ? (
        <InputForm {...questionProps}></InputForm>
      ) : (
        <div
          style={{
            display: "flex",
            width: "80%",
            justifyContent: "start",
            marginBottom: "20px",
          }}
        >
          <li className="question" style={{ width: "40%" }}>
            {question}
          </li>
          <li className="askee" style={{ width: "10%" }}>
            {askee}
          </li>
          <li className="status" style={{ width: "10%" }}>
            {status}
          </li>
          <Button
            style={{ width: "10%" }}
            onClick={() => setEditMode(true)}
            id={id}
          >
            <Edit />
          </Button>
          <Button
            style={{ width: "10%" }}
            onClick={() => deleteQuestion({ ...deleteQuestionProps })}
          >
            <Trash />
          </Button>
        </div>
      )}
    </>
  );
};
Question.propTypes = {
  question: string,
  askee: string,
  status: string,
  id: string,
  timestamp: Number,
  editQuestion: func,
  deleteQuestion: func,
  initialEditMode: bool,
};

export const Scorecomponent = ({ score }) => (
  <div>
    <h2>Score: {score}</h2>
  </div>
);
Scorecomponent.propTypes = {
  score: string,
};

const Rejection = ({
  questions = [],
  addQuestion = () => {},
  editQuestion = () => {},
  deleteQuestion = () => {},
  score = "0",
  getFromLocalStorage = () => {},
}) => {
  const questionProps = {
    editQuestion,
    deleteQuestion,
  };
  useEffect(() => {
    // this component is both a container and display component. OK for now.
    // this should dispatch the action to the store rather than call an action creator.
    getFromLocalStorage(); // is this the right component?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // pass an empty array as the second argument to load on page load.

  return (
    <div>
      <InputForm addQuestion={addQuestion} />
      <ul className=".question-list" style={{ listStyleType: "none" }}>
        {questions.map((question) => (
          <Question key={question.id} {...question} {...questionProps} />
        ))}
      </ul>
      <div style={{ position: "fixed", right: "100px", top: "40px" }}>
        <Scorecomponent score={score} />
      </div>
    </div>
  );
};

Rejection.propTypes = {
  questions: array,
  addQuestion: func,
  editQuestion: func,
  deleteQuestion: func,
  getFromLocalStorage: func,
  score: string,
  askee: string,
};

export default Rejection;
export { InputForm };
