import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../src/css/styles.css";
import Floaties from "./components/Floaties";
import Dashboard from "./pages/Dashboard";
import { IQuestion } from "./pages/Dashboard/FormStateType";
import Home from "./pages/Home";
import QuizTakeAndAnswers from "./pages/QuizTakeAndAnswers";
import Quizzes from "./pages/Quizzes";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { IQuestionResponse } from "./utils/IQuiz";
import { QuestionContext } from "./utils/QuestionContext";
import { IUserData, UserDataContext } from "./utils/UserDataContext";
import authorise from "./utils/authorise";
import fetchQuizzes from "./utils/fetchQuizzes";

const router = createBrowserRouter([
  { path: "/", loader: authorise, element: <Home /> },
  { path: "signup", loader: authorise, element: <Signup /> },
  { path: "signin", loader: authorise, element: <Signin /> },
  { path: "dashboard", loader: authorise, element: <Dashboard /> },
  {
    path: "quizzes",
    loader: async () => {
      const authorisationResult = await authorise();
      type Response = { error: string | null; data?: boolean; quizzes: IQuestionResponse[] | null };
      const finalData: Response = {} as Response;
      if (authorisationResult.error) {
        finalData.error = authorisationResult.error;
        finalData.data = false;
        finalData.quizzes = null;

        return finalData;
      }

      const quizzesFetchResult = await fetchQuizzes();
      finalData.error = quizzesFetchResult.error;
      finalData.data = authorisationResult.data;
      finalData.quizzes = quizzesFetchResult.quizzes;

      return finalData;
    },
    element: <Quizzes />,
  },
  {
    path: "quiz/:quizId",
    loader: authorise,
    element: <QuizTakeAndAnswers />,
  },
]);

export function App() {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [questions, setQuestions] = useState<IQuestion[] | null>(null);

  return (
    <React.StrictMode>
      <Floaties />
      <div className="navbar-delimiter"></div>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <QuestionContext.Provider value={{ questions, setQuestions }}>
          <RouterProvider router={router} />
        </QuestionContext.Provider>
      </UserDataContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
