import { useFormik } from "formik";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/quiz-take.css";
import computeResults from "../../utils/computeResults";
import { IQuestion } from "../../utils/IQuiz";
import { IUserData } from "../../utils/UserDataContext";
import { IDataResults, IFormState, IFormStateError } from "./FormStateType";
import Question from "./Question";

export default function QuizTake({
  questions,
  userData,
  setResultsData,
}: {
  questions: IQuestion[];
  userData: IUserData;
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
      const resultsData: IDataResults[] = computeResults(questions, formValues);
      type Response = { error: string | null; data?: IUserData };

      fetch("http://localhost/p-quiz/php/take_quiz.php", {
        method: "POST",
        body: JSON.stringify({
          user_id: userData.user_id,
          quiz_id: quizId,
          results: resultsData,
          timestamp: new Date().toLocaleString(),
        }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then(({ error, data }: Response) => {
          if (error) console.error(error);

          console.log(data);
        });

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
