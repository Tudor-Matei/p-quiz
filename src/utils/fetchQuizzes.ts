import { IQuestionResponse } from "./IQuiz";

export default async function fetchQuizzes(): Promise<{
  error: string | null;
  quizzes: IQuestionResponse[] | null;
}> {
  try {
    const response = await fetch("http://localhost/p-quiz/php/get_quizzes.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return { error: null, quizzes: result };
  } catch {
    return { error: "Error trying to get quizzes", quizzes: null };
  }
}
