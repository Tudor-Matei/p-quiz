import { useContext, useState } from "react";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/quiz-take.css";
import useLocalStorageUserData from "../../hooks/useLocalStorageUserData";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { IQuestionContext, QuestionContext } from "../../utils/QuestionContext";
import Answers from "./Answers";
import { IDataResults } from "./FormStateType";
import QuizTake from "./QuizTake";

export default function QuizTakeAndAnswers() {
  const { userData } = useLocalStorageUserData();
  const isNotLoggedIn = useRedirectOnAuth("/quizzes", false);

  const [resultsData, setResultsData] = useState<IDataResults[] | null>(null);
  const { questions }: IQuestionContext = useContext(QuestionContext);
  return isNotLoggedIn || userData === null ? null : (
    <>
      <SignedInNavbar fname={userData.fname} lname={userData.lname} />
      <section className="quiz-taking">
        {resultsData === null ? (
          questions === null ? (
            <h1>Error getting quiz...</h1>
          ) : (
            <QuizTake questions={questions} userData={userData} setResultsData={setResultsData} />
          )
        ) : (
          <Answers resultsData={resultsData} />
        )}
      </section>
    </>
  );
}
