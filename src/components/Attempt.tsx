import { useCallback, useState } from "react";
import { IAttempt } from "../utils/IAttempt";

export default function Attempt({ attempt }: { attempt: IAttempt }) {
  const [showQuestions, setShowQuestions] = useState(false);

  const toggleQuestions = () => {
    setShowQuestions(!showQuestions);
  };

  const computeScore = useCallback(() => {
    return attempt.results.reduce((acc, result) => {
      return result.isCorrect ? acc + 1 : acc;
    }, 0);
  }, [attempt.results]);

  return (
    <div className="attempts-container__attempt">
      <div className="attempt__header-container">
        <div className="attempt__header">
          {attempt.fname && attempt.lname && (
            <>
              <h3>
                Attempt by {attempt.fname} {attempt.lname}
              </h3>
              <div className="attempt__separator"></div>
            </>
          )}
          <p>
            Score: {computeScore()}/{attempt.results.length}
          </p>
          <div className="attempt__separator"></div>
          <span className="attempt__timestamp">{attempt.timestamp}</span>
        </div>
        <button className="primary-button" onClick={toggleQuestions}>
          {showQuestions ? "Hide Questions" : "Show Questions"}
        </button>
      </div>
      {showQuestions && (
        <>
          <div className="attempt__questions">
            {attempt.results.map((result, i) => (
              <div key={`attempt-${attempt.id}-question-${i}`} className="attempt__question">
                <h4>
                  {i + 1}. {result.title}
                </h4>
                <p>
                  Did answer correctly?
                  <img src={`../src/assets/${result.isCorrect ? "correct" : "wrong"}.svg`} />
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
