import { IAttempt } from "./IAttempt";
import { IQuestionResponse } from "./IQuiz";

export interface IDashboardData {
  quizzes?: IQuestionResponse[];
  attempts?: Omit<IAttempt, "user_id" | "fname" | "lname">[];
  randomQuiz: IQuestionResponse;
}
