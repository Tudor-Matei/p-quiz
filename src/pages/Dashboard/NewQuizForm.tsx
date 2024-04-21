import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import checkIfFormIsValid from "../../utils/isFormValid";
import { IFormState, IFormStateError, IQuestion } from "./FormStateType";
import Question from "./Question";
import validateNewQuizForm from "./validateNewQuizForm";

export default function NewQuizForm() {
  const formik = useFormik({
    initialValues: { title: "", subject: "", tags: "", questions: [] } as IFormState,
    validate: validateNewQuizForm,
    onSubmit: (values) => {
      fetch("http://localhost/p-quiz/php/add_quiz.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      })
        .then((response) => response.json())
        .then(({ error }: { error: string | null }) => {
          if (error !== null) {
            alert(error);
            formik.setSubmitting(false);
            return;
          }

          location.pathname = "/quizzes";
        });
    },
  });

  const addQuestion = useCallback(
    (type: "single" | "multiple") => {
      const newQuestion: IQuestion = { title: "", type, options: [{ title: "", isCorrectAnswer: false }] };
      formik.setFieldValue("questions", [...formik.values.questions, newQuestion]);
    },
    [formik]
  );

  const isFormValid = useMemo(
    () => checkIfFormIsValid(formik.touched, formik.errors) && formik.values.questions.length > 0,
    [formik]
  );
  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="title">
          Title{" "}
          {formik.touched.title && formik.errors.title && (
            <span className="invalid-field-indicator">{formik.errors.title}</span>
          )}
        </label>
        <input
          {...formik.getFieldProps("title")}
          className={formik.touched.title && formik.errors.title ? "input--error" : ""}
          required
          type="text"
          name="title"
          placeholder="type the title of the quiz here..."
        />
      </div>
      <div>
        <label htmlFor="subject">
          Subject{" "}
          {formik.touched.subject && formik.errors.subject && (
            <span className="invalid-field-indicator">{formik.errors.subject}</span>
          )}
        </label>
        <input
          {...formik.getFieldProps("subject")}
          className={formik.touched.subject && formik.errors.subject ? "input--error" : ""}
          required
          type="text"
          name="subject"
          placeholder="type the subject of the quiz here..."
        />
      </div>
      <div>
        <label htmlFor="tags">
          Tags{" "}
          {formik.touched.tags && formik.errors.tags && (
            <span className="invalid-field-indicator">{formik.errors.tags}</span>
          )}
        </label>
        <input
          {...formik.getFieldProps("tags")}
          required
          className={formik.touched.tags && formik.errors.tags ? "input--error" : ""}
          type="text"
          name="tags"
          placeholder="type tags that represent the quiz here, separated by a comma..."
        />
      </div>

      <div>
        {formik.values.questions.map((_, i) => (
          <Question
            questionIndex={i}
            formik={formik}
            deleteQuestionHandler={() =>
              formik.setFieldValue(
                "questions",
                formik.values.questions.filter((_, currentIndex) => currentIndex != i)
              )
            }
            key={`question-option-${i}`}
          />
        ))}
      </div>
      {formik.errors.questions && <span className="invalid-field-indicator">{formik.errors.questions as string}</span>}
      {(formik.errors as IFormStateError).options && (
        <span className="invalid-field-indicator">{(formik.errors as IFormStateError).options}</span>
      )}
      <div className="quiz-form__buttons">
        <div className="quiz-form-buttons__question-adders">
          <button className="default-button" type="button" onClick={() => addQuestion("single")}>
            Add single choice question
          </button>
          <button className="default-button" type="button" onClick={() => addQuestion("multiple")}>
            Add multiple choice question
          </button>
        </div>
        <button className="primary-button" disabled={!isFormValid || formik.isSubmitting}>
          {isFormValid ? "Publish quiz" : "Not yet..."}
        </button>
      </div>
    </form>
  );
}
