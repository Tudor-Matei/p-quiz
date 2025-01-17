import { IDashboardData } from "./IDashboardData";
import { IQuestionResponse } from "./IQuiz";

export default async function fetchDashboardData(): Promise<{
  error: string | null;
  dashboardData: (Omit<IDashboardData, "randomQuizId"> & { random_quiz: IQuestionResponse }) | null;
}> {
  try {
    const response = await fetch(`http://localhost/p-quiz/php/get_dashboard_data.php`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.attempts) {
      for (const attempt of result.attempts) {
        attempt.results = JSON.parse(attempt.results);
      }
    }
    return { error: null, dashboardData: result };
  } catch (error) {
    console.error(error);
    return { error: "Error trying to get the dashboard data", dashboardData: null };
  }
}
