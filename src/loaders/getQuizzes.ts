import fetchQuizzes from "../utils/fetchQuizzes";
import { IQuestionResponse } from "../utils/IQuiz";
import authorise from "./authorise";

export default async function getQuizzes() {
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
}
