import cuid from "cuid";
import React from "react";
import { describe } from "riteway";
import render from "riteway/render-component";
import match from "riteway/match";
import Rejection, {
  InputForm,
  Question,
  Scorecomponent,
} from "./rejection-component";

const createQuestion = ({
  id = cuid(),
  question = "Sample question...",
  askee = "Who are you asking?",
  status = "unanswered",
} = {}) => ({
  id,
  question,
  askee,
  status,
});

describe("rejection component", async (assert) => {
  {
    const questions = [createQuestion(), createQuestion(), createQuestion()];
    const $ = render(<Rejection questions={questions} />);
    assert({
      given: "some question",
      should: "render the questions",
      actual: $(".question").length,
      expected: questions.length,
    });
  }
});

describe("InputForm", async (assert) => {
  {
    const $ = render(<InputForm />);

    assert({
      given: "no arguments",
      should: "render the question input field",
      actual: $(".question-input-field").length,
      expected: 1,
    });
  }
  {
    const $ = render(<InputForm />);

    assert({
      given: "no arguments",
      should: "render the askee input field",
      actual: $(".askee-input-field").length,
      expected: 1,
    });
  }

  {
    // Compiles the Rejection component to HTML
    // returns the string of that HTML wrapped inside an object that can query it.
    const $ = render(<InputForm />);

    assert({
      given: "no arguments",
      should: "render the accepted button",
      actual: $(".accepted-button").length,
      expected: 1,
    });
  }
  {
    // Compiles the Rejection component to HTML
    // returns the string of that HTML wrapped inside an object that can query it.
    const $ = render(<InputForm />);

    assert({
      given: "no arguments",
      should: "render the rejected button",
      actual: $(".rejected-button").length,
      expected: 1,
    });
  }
  {
    // Compiles the Rejection component to HTML
    // returns the string of that HTML wrapped inside an object that can query it.
    const $ = render(<InputForm />);

    assert({
      given: "no arguments",
      should: "render the unanswered button",
      actual: $(".unanswered-button").length,
      expected: 1,
    });
  }
  {
    const askee = "peter";
    const $ = render(<InputForm askee={askee} />);
    const contains = match($.html());

    assert({
      given: "an askee",
      should: "render the askee",
      actual: contains(askee),
      expected: askee,
    });
  }
  {
    const question = "do you have a light";
    const $ = render(<InputForm question={"do you have a light"} />);
    const contains = match($.html());

    assert({
      given: "a question",
      should: "render the question",
      actual: contains(question),
      expected: question,
    });
  }
});

describe("question component", async (assert) => {
  const question = "Can I have an icecream?";
  const props = createQuestion({
    question,
  });
  const $ = render(<Question {...props} />);
  const contains = match($.html());

  assert({
    given: "a question",
    should: "render the question",
    actual: contains("Can I have an icecream\\?"),
    expected: question,
  });

  assert({
    given: "an askee",
    should: "render the question",
    actual: contains("Can I have an icecream\\?"),
    expected: question,
  });
});

describe("score component", async (assert) => {
  {
    const score = "10";
    const $ = render(<Scorecomponent score={score} />);
    const contains = match($.html());

    assert({
      given: "a score prop",
      should: "display the correct score",
      actual: contains("10"),
      expected: score,
    });
  }
});
