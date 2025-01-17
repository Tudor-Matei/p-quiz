import { IDataResults } from "../pages/QuizTakeAndAnswers/FormStateType";

export interface IAttempt {
  id: string;
  user_id?: string;
  quiz_id: string;
  fname?: string;
  lname?: string;
  quiz_title: string;
  timestamp: string;
  results: IDataResults[];
}
