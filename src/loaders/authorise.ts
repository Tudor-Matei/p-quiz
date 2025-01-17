export default function authorise(): Promise<{ error: string | null; data: boolean }> {
  return fetch("http://localhost/p-quiz/php/auth.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch(() => ({ error: "Error trying to authorise", data: null }));
}
