import { useContext, useEffect, useMemo } from "react";
import { Link, useLoaderData } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/quizzes.css";
import { IQuestionResponse } from "../../utils/IQuiz";
import { QuestionContext } from "../../utils/QuestionContext";
import { UserDataContext } from "../../utils/UserDataContext";
import { IQuestion } from "../Dashboard/FormStateType";
export default function Quizzes() {
  type LoaderDataType = { error?: string | null; data?: boolean; quizzes: IQuestionResponse[] | null };
  const { userData, setUserData } = useContext(UserDataContext);
  const { error, data, quizzes }: LoaderDataType = useLoaderData() as LoaderDataType;

  const isLoggedIn = useMemo(() => error === null && data === true, [error, data]);
  useEffect(() => {
    if (userData === null) {
      const savedData: string | null = localStorage.getItem("data");
      setUserData(savedData === null ? null : JSON.parse(savedData));
    }
  }, []);

  const { setQuestions } = useContext(QuestionContext);
  return (
    <>
      {isLoggedIn && userData !== null ? <SignedInNavbar fname={userData.fname} lname={userData.lname} /> : <Navbar />}
      <section className="quizzes">
        {quizzes?.length === 0 ? (
          <h1>No quizzes found.</h1>
        ) : (
          quizzes?.map(({ title, subject, id, tags, questions }) => (
            <Quiz
              key={id}
              title={title}
              subject={subject}
              id={id}
              tags={tags.split(",")}
              questionCount={(JSON.parse(questions) as IQuestion[]).length}
              quizTakeHandler={() => setQuestions(JSON.parse(questions) as IQuestion[])}
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </section>
    </>
  );
}

function Quiz({
  title,
  subject,
  id,
  tags,
  questionCount,
  isLoggedIn,
  quizTakeHandler,
}: {
  title: string;
  subject: string;
  id: string;
  tags: string[];
  questionCount: number;
  isLoggedIn: boolean;
  quizTakeHandler: () => void;
}) {
  return (
    <div className="quizzes__quiz">
      <div className="quizzes-quiz__information">
        <h2>{title}</h2>
        <span className="quiz__separator"></span>
        <p>{subject}</p>
        <span className="quiz__separator"></span>
        <p>id: #{id}</p>
      </div>
      <div className="quiz__tags">
        {tags.map((tag, i) => (
          <span key={`quiz-${id}-tag-${i}`} className="quiz-tags__tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="quizzes-quiz__action">
        <h4>
          {questionCount} question{questionCount > 1 ? "s" : ""}
        </h4>
        <Link to={isLoggedIn ? `/quiz/${id}` : "/signin"}>
          <button onClick={quizTakeHandler} className="primary-button">
            Take quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
