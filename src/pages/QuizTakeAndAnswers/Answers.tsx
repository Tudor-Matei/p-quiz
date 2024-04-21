import { useMemo } from "react";
import { IDataResults } from "./FormStateType";

export default function Answers({ resultsData }: { resultsData: IDataResults[] | null }) {
  const correctQuestionsCount =
    useMemo(
      () =>
        resultsData?.reduce(
          (correctQuestionsCount, currentQuestion) =>
            currentQuestion.isCorrect ? correctQuestionsCount + 1 : correctQuestionsCount,
          0
        ),
      [resultsData]
    ) || 0;

  const percentageOfCorrectQuestions: number = useMemo(() => {
    const questionsCount = resultsData?.length || 1;
    return (correctQuestionsCount / questionsCount) * 100;
  }, [resultsData, correctQuestionsCount]);

  return (
    <>
      <header
        className="quiz-take__results-header"
        style={{
          backgroundColor:
            percentageOfCorrectQuestions < 50
              ? "var(--bad-results-color)"
              : percentageOfCorrectQuestions < 80
              ? "var(--borderline-results-color)"
              : "var(--good-results-color)",
        }}
      >
        <h1>
          Your final score is {correctQuestionsCount}/{resultsData?.length}
        </h1>
      </header>
      <table className="answers-table">
        <thead>
          <tr>
            <th>Question title</th>
            <th>Is correct?</th>
          </tr>
        </thead>
        <tbody>
          {resultsData?.map(({ title, isCorrect }, i) => (
            <tr key={`title-${i}`}>
              <td>{title}</td>
              <td>
                <img src={`../../src/assets/${isCorrect ? "correct" : "wrong"}.svg`} alt="question status" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
