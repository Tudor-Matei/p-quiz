import { createContext } from "react";
import { IQuestion } from "./IQuiz";

export interface IQuestionContext {
  questions: IQuestion[] | null;
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[] | null>>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const QuestionContext = createContext({ questions: null, setQuestions: () => {} } as IQuestionContext);
