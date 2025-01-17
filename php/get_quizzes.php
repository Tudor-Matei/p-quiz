<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'db/UserKeys.php';
include_once 'utils/is_logged_in.php';

$log_in_state = is_logged_in($connection);

$retrieve_quizzes_query = "SELECT q.*, COUNT(CASE WHEN u.role = 'student' THEN 1 END) AS student_attempts
                          FROM quizzes q
                          LEFT JOIN attempts a ON q.id = a.quiz_id
                          LEFT JOIN users u ON a.user_id = u.id
                          GROUP BY q.id;";
$retrieve_quizzes_statement = mysqli_prepare($connection, $retrieve_quizzes_query);

if (!mysqli_execute($retrieve_quizzes_statement)) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error executing the query."]);
  die();
}

$quizzes_query_result = mysqli_stmt_get_result($retrieve_quizzes_statement);
if ($quizzes_query_result === false) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error fetching the quizzes."]);
  die();
}
$quizzes_result_row = mysqli_fetch_assoc($quizzes_query_result);
$quizzes = [];

while ($quizzes_result_row !== null) {
  array_push($quizzes, $quizzes_result_row);
  $quizzes_result_row = mysqli_fetch_assoc($quizzes_query_result);
}

echo json_encode($quizzes);