import { FormikProps } from "formik";
import { ChangeEvent, useCallback } from "react";
import { IFormState, IQuestion } from "./FormStateType";

export default function Question({
  questionIndex,
  formik,
  deleteQuestionHandler,
}: {
  questionIndex: number;
  formik: FormikProps<IFormState>;
  deleteQuestionHandler: () => void;
}) {
  const changeOptionTitle = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      const questionsFormArray: IQuestion[] = formik.values.questions;
      questionsFormArray[questionIndex].title = value;
      formik.setFieldValue("questions", questionsFormArray);
    },
    [formik, questionIndex]
  );

  const addAnotherOption = useCallback(() => {
    const questionsFormArray: IQuestion[] = formik.values.questions;
    questionsFormArray[questionIndex].options.push({ title: "", isCorrectAnswer: false });
    formik.setFieldValue("questions", questionsFormArray);
  }, [formik, questionIndex]);

  const deleteOption = useCallback(
    (optionIndex: number) => () => {
      const questionsFormArray = formik.values.questions;
      const filteredQuestionOptions = formik.values.questions[questionIndex].options.filter(
        (_, currentOptionIndex) => currentOptionIndex != optionIndex
      );

      questionsFormArray[questionIndex].options = filteredQuestionOptions;
      formik.setFieldValue("questions", questionsFormArray);
    },
    [formik, questionIndex]
  );

  return (
    <div className="quiz-form__question">
      <div className="quiz-form__label-with-delete">
        <label htmlFor="title">Question {questionIndex + 1} title</label>
        <button onClick={deleteQuestionHandler} type="button" className="quiz-form__delete-button">
          <img src="src/assets/delete.svg" />
        </button>
      </div>

      <input
        onChange={changeOptionTitle}
        value={formik.values.questions[questionIndex].title}
        required
        type="text"
        placeholder="type the title of the question here..."
      />

      <div className="quiz-form__indented-questions">
        {formik.values.questions[questionIndex].options.map((_, optionIndex) => (
          <QuestionOption
            questionIndex={questionIndex}
            optionIndex={optionIndex}
            formik={formik}
            deleteQuestionOptionHandler={deleteOption(optionIndex)}
            key={`question-${questionIndex}-option-${optionIndex}`}
          />
        ))}

        <button
          onClick={addAnotherOption}
          type="button"
          className="indented-questions__add-another-option default-button"
        >
          Add another option
        </button>
      </div>
    </div>
  );
}

function QuestionOption({
  questionIndex,
  optionIndex,
  formik,
  deleteQuestionOptionHandler,
}: {
  questionIndex: number;
  optionIndex: number;
  formik: FormikProps<IFormState>;
  deleteQuestionOptionHandler: () => void;
}) {
  const changeOptionTitle = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      const questionsFormArray: IQuestion[] = formik.values.questions;
      questionsFormArray[questionIndex].options[optionIndex].title = value;
      formik.setFieldValue("questions", questionsFormArray);
    },
    [formik, questionIndex, optionIndex]
  );

  return (
    <div className="indented-questions__single-option">
      <input
        value={formik.values.questions[questionIndex].options[optionIndex].title}
        onChange={changeOptionTitle}
        required
        type="text"
        placeholder="type the option here..."
      />
      <div className="single-option__mark-as-correct">
        <MarkOptionAsCorrect questionIndex={questionIndex} optionIndex={optionIndex} formik={formik} />
        <button type="button" className="quiz-form__delete-button" onClick={deleteQuestionOptionHandler}>
          <img src="src/assets/delete.svg" />
        </button>
      </div>
    </div>
  );
}

function MarkOptionAsCorrect({
  questionIndex,
  optionIndex,
  formik,
}: {
  questionIndex: number;
  optionIndex: number;
  formik: FormikProps<IFormState>;
}) {
  const markOptionAsCorrectHandler = useCallback(
    ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      const questionsFormArray: IQuestion[] = formik.values.questions;

      if (questionsFormArray[questionIndex].type === "single")
        for (const currentOption of questionsFormArray[questionIndex].options)
          if (currentOption.isCorrectAnswer) currentOption.isCorrectAnswer = false;

      questionsFormArray[questionIndex].options[optionIndex].isCorrectAnswer = checked;
      formik.setFieldValue("questions", questionsFormArray);
    },
    [formik, questionIndex, optionIndex]
  );

  return (
    <>
      {formik.values.questions[questionIndex].type === "single" ? (
        <input
          onChange={markOptionAsCorrectHandler}
          required
          name="is-correct"
          type="radio"
          checked={formik.values.questions[questionIndex].options[optionIndex].isCorrectAnswer}
        />
      ) : (
        <input
          onChange={markOptionAsCorrectHandler}
          type="checkbox"
          checked={formik.values.questions[questionIndex].options[optionIndex].isCorrectAnswer}
        />
      )}
      <label htmlFor="is-correct">mark as correct</label>
    </>
  );
}
