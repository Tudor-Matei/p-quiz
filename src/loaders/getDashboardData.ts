import fetchDashboardData from "../utils/fetchDashboardData";
import { IDashboardData } from "../utils/IDashboardData";
import authorise from "./authorise";

export default async function getDashboardData() {
  const authorisationResult = await authorise();

  type Response = { error: string | null; data?: boolean } & IDashboardData;
  const finalData: Response = {} as Response;
  if (authorisationResult.error) {
    finalData.error = authorisationResult.error;
    finalData.data = false;
    finalData.quizzes = undefined;

    return finalData;
  }

  const { error, dashboardData } = await fetchDashboardData();
  finalData.error = error;
  finalData.data = authorisationResult.data;
  finalData.quizzes = dashboardData?.quizzes;
  finalData.attempts = dashboardData?.attempts;
  if (dashboardData?.random_quiz) finalData.randomQuiz = dashboardData?.random_quiz;

  return finalData;
}
