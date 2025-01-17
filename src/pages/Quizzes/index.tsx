import { useContext, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Quiz from "../../components/Quiz";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/quizzes.css";
import useLocalStorageUserData from "../../hooks/useLocalStorageUserData";
import { IQuestionResponse } from "../../utils/IQuiz";
import { QuestionContext } from "../../utils/QuestionContext";
import { IQuestion } from "../Dashboard/FormStateType";

export default function Quizzes() {
  type LoaderDataType = { error?: string | null; data?: boolean; quizzes: IQuestionResponse[] | null };
  const { error, data, quizzes }: LoaderDataType = useLoaderData() as LoaderDataType;

  const isLoggedIn = useMemo(() => error === null && data === true, [error, data]);

  const { userData } = useLocalStorageUserData();

  const { setQuestions } = useContext(QuestionContext);
  return (
    <>
      {isLoggedIn && userData !== null ? <SignedInNavbar fname={userData.fname} lname={userData.lname} /> : <Navbar />}
      <section className="quizzes">
        {quizzes?.length === 0 ? (
          <h1>No quizzes found.</h1>
        ) : (
          quizzes?.map(({ title, subject, id, tags, questions, student_attempts }) => (
            <Quiz
              key={id}
              title={title}
              subject={subject}
              id={id}
              userRole={userData?.role || "student"}
              tags={tags.split(",")}
              questionCount={(JSON.parse(questions) as IQuestion[]).length}
              studentsCount={student_attempts}
              quizTakeHandler={() => setQuestions(JSON.parse(questions) as IQuestion[])}
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </section>
    </>
  );
}
