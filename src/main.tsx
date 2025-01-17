import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../src/css/styles.css";
import Floaties from "./components/Floaties";
import authorise from "./loaders/authorise";
import getAttempts from "./loaders/getAttempts";
import getDashboardData from "./loaders/getDashboardData";
import getQuizzes from "./loaders/getQuizzes";
import Attempts from "./pages/Attempts";
import Dashboard from "./pages/Dashboard";
import { IQuestion } from "./pages/Dashboard/FormStateType";
import Home from "./pages/Home";
import QuizTakeAndAnswers from "./pages/QuizTakeAndAnswers";
import Quizzes from "./pages/Quizzes";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { QuestionContext } from "./utils/QuestionContext";
import { IUserData, UserDataContext } from "./utils/UserDataContext";

const router = createBrowserRouter([
  { path: "/", loader: authorise, element: <Home /> },
  { path: "signup", loader: authorise, element: <Signup /> },
  { path: "signin", loader: authorise, element: <Signin /> },
  { path: "dashboard", loader: getDashboardData, element: <Dashboard /> },
  { path: "quizzes", loader: getQuizzes, element: <Quizzes /> },
  { path: "quiz/:quizId", loader: authorise, element: <QuizTakeAndAnswers /> },
  { path: "attempts/:quizId", loader: getAttempts, element: <Attempts /> },
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
