import { useContext, useMemo } from "react";
import { Link, useLoaderData } from "react-router-dom";
import Attempt from "../../components/Attempt";
import Quiz from "../../components/Quiz";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/dashboard.css";
import useLocalStorageUserData from "../../hooks/useLocalStorageUserData";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { IDashboardData } from "../../utils/IDashboardData";
import { IQuestion } from "../../utils/IQuiz";
import { QuestionContext } from "../../utils/QuestionContext";
import NewQuizForm from "./NewQuizForm";
export default function Dashboard() {
  useRedirectOnAuth("/", false);
  const { userData } = useLocalStorageUserData();
  const dashboardData = useLoaderData() as IDashboardData & { error?: string | null; data: boolean };
  const { setQuestions } = useContext(QuestionContext);

  const studentsThatTookQuizzesCount = useMemo(
    () =>
      dashboardData.quizzes?.reduce((acc, quiz) => {
        return acc + quiz.student_attempts;
      }, 0),
    [dashboardData.quizzes]
  );

  const averageScoreStudent = useMemo(() => {
    if (!dashboardData.attempts) return 0;

    const totalScore = dashboardData.attempts.reduce(
      (acc, attempt) => acc + attempt.results.reduce((score, result) => (result.isCorrect ? score + 1 : score), 0),
      0
    );

    return (totalScore / dashboardData.attempts.length).toFixed(2);
  }, [dashboardData.attempts]);

  if (dashboardData.error) {
    alert(dashboardData.error);
    return null;
  }

  return userData === null || dashboardData === null || !dashboardData.data || dashboardData.error ? null : (
    <>
      <SignedInNavbar fname={userData.fname} lname={userData.lname} />

      <div className="first-delim section-title">
        <h1>Here are your account details</h1>
        <hr />
      </div>

      <section className="account-details">
        <div className="account-details__detail">
          <p>first name</p>
          <h2>{userData.fname}</h2>
        </div>
        <div className="account-details__detail">
          <p>last name</p>
          <h2>{userData.lname}</h2>
        </div>
        <div className="account-details__detail">
          <p>e-mail</p>
          <h2>{userData.email}</h2>
        </div>
        <div className="account-details__detail">
          <p>you are a</p>
          <h2>{userData.role}</h2>
        </div>
        {userData.role === "teacher" ? (
          <>
            <div className="account-details__detail">
              <p>you've created</p>
              <h2>{dashboardData.quizzes?.length} quizzes</h2>
            </div>
            <div className="account-details__detail">
              <p>number of students that took your quizzes</p>
              <h2>{studentsThatTookQuizzesCount}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="account-details__detail">
              <p>you've taken</p>
              <h2>
                {dashboardData.attempts?.length} quiz
                {(dashboardData.attempts?.length || 0) > 1 || dashboardData.attempts?.length === 0 ? "zes" : ""}
              </h2>
            </div>
            <div className="account-details__detail">
              <p>your average score is</p>
              <h2>{averageScoreStudent === "NaN" ? "undetermined" : averageScoreStudent}</h2>
            </div>
          </>
        )}
        <div className="account-details__detail">
          <p>account creation date</p>
          <h2>{userData.created_at}</h2>
        </div>
        <div className="account-details__detail">
          <p>user id</p>
          <h2>#{userData.user_id}</h2>
        </div>
      </section>

      <section className="dashboard__personalised">
        <Link to={`/quiz/${dashboardData.randomQuiz.id}`}>
          <button
            className="default-button dashboard__personalised__button"
            onClick={() => setQuestions(JSON.parse(dashboardData.randomQuiz.questions))}
          >
            Take a random quiz!
          </button>
        </Link>
      </section>
      {userData.role === "teacher" && (
        <>
          <div className="section-title">
            <hr />
            <h1>Create a new quiz right here</h1>
          </div>
          <section className="quiz-form">
            <NewQuizForm />
          </section>
        </>
      )}
      <div className="section-title">
        <h1>Your {userData.role === "student" ? "history" : "quizzes"}</h1>
        <hr />
      </div>

      {userData.role === "teacher" ? (
        <div className="dashboard__personalised">
          {dashboardData.quizzes?.length === 0 && <p>You have not created any quizzes yet.</p>}
          {dashboardData.quizzes?.map((quiz) => (
            <Quiz
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              subject={quiz.subject}
              userRole={userData.role}
              tags={quiz.tags.split(",")}
              studentsCount={quiz.student_attempts}
              quizTakeHandler={() => setQuestions(JSON.parse(quiz.questions) as IQuestion[])}
              questionCount={JSON.parse(quiz.questions).length}
              isLoggedIn={true}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard__personalised">
          {dashboardData.attempts?.length === 0 && <p>You have taken any quizzes yet.</p>}
          {dashboardData.attempts?.map((attempt) => (
            <Attempt key={attempt.id} attempt={attempt} />
          ))}
        </div>
      )}
    </>
  );
}
