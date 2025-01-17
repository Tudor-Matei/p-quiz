<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'db/UserKeys.php';
include_once 'utils/is_logged_in.php';

$log_in_state = is_logged_in($connection);

if (!$log_in_state) {
  http_response_code(401);
  echo json_encode(["error" => "User is not logged in."]);
  die();
}

$attempt_id = $_GET['id'];

if (!isset($attempt_id)) {
  http_response_code(400);
  echo json_encode(["error" => "Bad user input."]);
  die();
}

$retrieve_attempts_query = "SELECT DISTINCT a.*, u.fname, u.lname, q.title AS quiz_title
                            FROM attempts a
                            LEFT JOIN users u ON a.user_id = u.id
                            LEFT JOIN quizzes q ON a.quiz_id = q.id
                            WHERE u.role = 'student' AND q.id = ?;";

$retrieve_attempts_statement = mysqli_prepare($connection, $retrieve_attempts_query);
mysqli_stmt_bind_param($retrieve_attempts_statement, 'i', $attempt_id);

if (!mysqli_execute($retrieve_attempts_statement)) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error executing the query."]);
  die();
}

$attempts_query_result = mysqli_stmt_get_result($retrieve_attempts_statement);
if ($attempts_query_result === false) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error fetching the attempts."]);
  die();
}

$attempts = [];
while ($row = mysqli_fetch_assoc($attempts_query_result)) {
  $attempts[] = $row;
}

http_response_code(200);
echo json_encode($attempts);