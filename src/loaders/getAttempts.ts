import { LoaderFunctionArgs } from "react-router-dom";
import fetchAttempts from "../utils/fetchAttempts";
import { IAttempt } from "../utils/IAttempt";
import authorise from "./authorise";

export default async function getAttempts({ params }: LoaderFunctionArgs) {
  if (!params.quizId) {
    return {};
  }

  const authorisationResult = await authorise();
  type Response = { error: string | null; data?: boolean; attempts: IAttempt[] | null };
  const finalData: Response = {} as Response;
  if (authorisationResult.error) {
    finalData.error = authorisationResult.error;
    finalData.data = false;
    finalData.attempts = null;

    return finalData;
  }

  const attemptsFetchResult = await fetchAttempts(params.quizId);
  finalData.error = attemptsFetchResult.error;
  finalData.data = authorisationResult.data;
  finalData.attempts = attemptsFetchResult.attempts;

  return finalData;
}
