import { Link } from "react-router-dom";

export default function Quiz({
  title,
  subject,
  id,
  userRole,
  tags,
  questionCount,
  studentsCount,
  isLoggedIn,
  quizTakeHandler,
}: {
  title: string;
  subject: string;
  id: string;
  userRole: string;
  tags: string[];
  questionCount: number;
  studentsCount: number;
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
            {tag.replaceAll("&#39;", "'")}
          </span>
        ))}
      </div>

      <div className="quizzes-quiz__action">
        <div className="quizzes-quiz-action__labels">
          <div className="quizzes-quiz-action__label">
            <img src="src/assets/quiz.svg" />
            <h4>
              {questionCount} question{questionCount > 1 ? "s" : ""}
            </h4>
          </div>
          {userRole === "student" ? (
            <div className="quizzes-quiz-action__label">
              <img src="src/assets/user.svg" />
              <h4>
                {studentsCount} student{studentsCount > 1 || studentsCount === 0 ? "s" : ""} took this quiz
              </h4>
            </div>
          ) : (
            <Link to={`/attempts/${id}`}>
              <div className="quizzes-quiz-action__label">
                <img src="src/assets/user.svg" />
                <h4>
                  {studentsCount} student{studentsCount > 1 || studentsCount === 0 ? "s" : ""} took this quiz
                </h4>
              </div>
            </Link>
          )}
        </div>
        <Link to={isLoggedIn ? `/quiz/${id}` : "/signin"}>
          <button onClick={quizTakeHandler} className="primary-button">
            Take quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
