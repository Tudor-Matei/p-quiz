import { useFormik } from "formik";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/quiz-take.css";
import { IQuestion } from "../../utils/IQuiz";
import { IDataResults, IFormState, IFormStateError } from "./FormStateType";
import Question from "./Question";

export default function QuizTake({
  questions,
  setResultsData,
}: {
  questions: IQuestion[];
  setResultsData: React.Dispatch<React.SetStateAction<IDataResults[] | null>>;
}) {
  const { quizId } = useParams();
  const formik = useFormik({
    initialValues: questions.reduce((initialValues, question) => {
      return {
        ...initialValues,
        [question.title]: question.options.map((option) => ({ title: option.title, markedAsCorrect: false })),
      };
    }, {}),

    validate: (formValues: IFormState): IFormStateError => {
      const errors: IFormStateError = {};
      for (const questionTitle of Object.keys(formValues)) {
        if (formValues[questionTitle].every((option) => !option.markedAsCorrect))
          errors[questionTitle] = "You have not marked any answer to be correct.";
      }
      return errors;
    },

    onSubmit: (formValues: IFormState) => {
      const resultsData: IDataResults[] = [];

      for (const question of questions) {
        const answersForCurrentQuestion = formValues[question.title];
        let isCorrectSoFar = true;
        for (const currentAnswer of answersForCurrentQuestion) {
          const correctAnswerOption = question.options.find(({ title }) => title === currentAnswer.title);
          if (correctAnswerOption === undefined) continue;

          if (
            (!correctAnswerOption.isCorrectAnswer && currentAnswer.markedAsCorrect) ||
            (correctAnswerOption.isCorrectAnswer && !currentAnswer.markedAsCorrect)
          ) {
            isCorrectSoFar = false;
            break;
          }
        }
        resultsData.push({ title: question.title, isCorrect: isCorrectSoFar });
      }

      setResultsData(resultsData);
    },
  });

  const isFormValid = useMemo(
    () => Object.keys(formik.touched).length === questions.length && Object.keys(formik.errors).length === 0,
    [formik, questions.length]
  );
  return (
    <>
      <form onSubmit={formik.handleSubmit} className="quiz-taking__form">
        {questions.map((question, i) => (
          <Question
            key={`question-${quizId}-${i}`}
            type={question.type}
            title={question.title}
            options={question.options}
            formik={formik}
          />
        ))}
        <div className="quiz-taking-form__buttons">
          <button className="primary-button" disabled={!isFormValid || formik.isSubmitting}>
            {isFormValid ? "Submit results" : "Not yet..."}
          </button>
          <Link to="/quizzes">
            <button type="button" className="default-button">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </>
  );
}
