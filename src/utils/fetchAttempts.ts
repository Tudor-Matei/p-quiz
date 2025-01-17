import { IAttempt } from "./IAttempt";

export default async function fetchAttempts(
  id: string
): Promise<{ error: string | null; attempts: IAttempt[] | null }> {
  try {
    const response = await fetch(`http://localhost/p-quiz/php/get_attempts.php?id=${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    for (const attempt of result) {
      attempt.results = JSON.parse(attempt.results);
    }
    return { error: null, attempts: result };
  } catch {
    return { error: "Error trying to get attempts", attempts: null };
  }
}
