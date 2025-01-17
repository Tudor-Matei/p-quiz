<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'utils/is_logged_in.php';
include_once 'utils/generate_random_id.php';
include_once 'db/UserKeys.php';

$log_in_state = is_logged_in($connection);

if (isset($log_in_state['error'])) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error trying to check if the user is logged in."]);
  die();
}

if (!isset($_POST['user_id']) || !isset($_POST['quiz_id']) || !isset($_POST['results']) || !isset($_POST['timestamp'])) {
  http_response_code(400);
  echo json_encode(["error" => "Bad user input."]);
  die();
}

$user_id = trim(filter_var($_POST['user_id'], FILTER_SANITIZE_STRING));
$quiz_id = trim(filter_var($_POST['quiz_id'], FILTER_SANITIZE_STRING));
$timestamp = trim(filter_var($_POST['timestamp'], FILTER_SANITIZE_STRING));

$results = $_POST['results'];

if (strlen($user_id) < 3 || strlen($quiz_id) < 3 || strlen($timestamp) < 3) {
  http_response_code(400);
  echo json_encode(["error" => "The user id, quiz id or timestamp are invalid."]);
  die();
}

$attempt_id = generate_random_id(6);
$quiz_insert_query = "INSERT INTO attempts (id, user_id, quiz_id, results, timestamp) VALUES (?,?,?,?,?)";
$stringified_results = json_encode($results);

$statement = mysqli_prepare($connection, $quiz_insert_query);
if (!mysqli_stmt_bind_param($statement, "sssss", $attempt_id, $user_id, $quiz_id, $stringified_results, $timestamp)) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error binding parameters to the query."]);
  die();
}

$did_insert_into_db = mysqli_stmt_execute($statement);
$did_close_statement_successfully = mysqli_stmt_close($statement);
if (!$did_close_statement_successfully) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error closing the statement."]);
  die();
}

if (!$did_insert_into_db) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error inserting the attempt into the database."]);
  die();
}

echo json_encode(["error" => null]);


