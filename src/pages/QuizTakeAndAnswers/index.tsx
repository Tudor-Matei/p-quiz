import { useContext, useEffect, useState } from "react";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/quiz-take.css";
import { IQuestionContext, QuestionContext } from "../../utils/QuestionContext";
import { UserDataContext } from "../../utils/UserDataContext";
import useRedirectOnAuth from "../../utils/useRedirectOnAuth";
import Answers from "./Answers";
import { IDataResults } from "./FormStateType";
import QuizTake from "./QuizTake";

export default function QuizTakeAndAnswers() {
  const { userData, setUserData } = useContext(UserDataContext);
  const isNotLoggedIn = useRedirectOnAuth("/quizzes", false);
  useEffect(() => {
    if (userData === null) {
      const savedData: string | null = localStorage.getItem("data");
      setUserData(savedData === null ? null : JSON.parse(savedData));
    }
  }, []);

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
            <QuizTake questions={questions} setResultsData={setResultsData} />
          )
        ) : (
          <Answers resultsData={resultsData} />
        )}
      </section>
    </>
  );
}
