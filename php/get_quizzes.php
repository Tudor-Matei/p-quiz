<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'db/UserKeys.php';
include_once 'utils/is_logged_in.php';

$log_in_state = is_logged_in($connection);

$retrieve_quizzes_query = "SELECT * FROM quizzes";
$statement = mysqli_prepare($connection, $retrieve_quizzes_query);

if (!mysqli_execute($statement)) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error executing the query."]);
  die();
}

$quizzes_query_result = mysqli_stmt_get_result($statement);
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