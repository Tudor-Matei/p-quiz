<?php

include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'db/UserKeys.php';
include_once 'utils/is_logged_in.php';
include_once 'utils/generate_random_id.php';

$log_in_state = is_logged_in($connection);

if (isset($log_in_state['error'])) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error trying to check if the user is logged in."]);
  die();
}

if ($log_in_state === false) {
  http_response_code(401);
  echo json_encode(["error" => "User is not logged in."]);
  die();
}


if (!isset($_POST['title']) || !isset($_POST['subject']) || !isset($_POST['tags']) || !isset($_POST['questions'])) {
  http_response_code(400);
  echo json_encode(["error" => "Bad user input."]);
  die();
}

$title = trim(filter_var($_POST['title'], FILTER_SANITIZE_STRING));
$subject = trim(filter_var($_POST['subject'], FILTER_SANITIZE_STRING));
$tags = trim(filter_var($_POST['tags'], FILTER_SANITIZE_STRING));
$questions = $_POST['questions'];

if (strlen($title) < 3) {
  http_response_code(400);
  echo json_encode(["error" => "The title is too short. Make it at least 3 letters."]);
  die();
}

if (strlen($subject) < 3) {
  http_response_code(400);
  echo json_encode(["error" => "The subhect name is too short. Make it at least 3 letters."]);
  die();
}

if (strlen($tags) === 0) {
  http_response_code(400);
  echo json_encode(["error" => "The tags are missing."]);
  die();
}

for ($i = 0; $i < sizeof($questions); $i++) {
  $question = $questions[$i];
  $question['title'] = trim(filter_var($question['title'], FILTER_SANITIZE_STRING));
  $question['type'] = trim(filter_var($question['type'], FILTER_SANITIZE_STRING));
  if (strlen($question['title']) < 3) {
    http_response_code(400);
    echo json_encode(["error" => "The subject is too short. Make it at least 3 letters."]);
    die();
  }

  if ($question['type'] !== "single" && $question['type'] !== "multiple") {
    http_response_code(400);
    echo json_encode(["error" => "The question type is neither 'single' nor 'multiple'. Did you tamper with the request?"]);
    die();
  }

  $question_options = $question['options'];
  for ($j = 0; $j < sizeof($question_options); $j++) {
    $question_option = $question_options[$j];
    $question_option['title'] = trim(filter_var($question['title'], FILTER_SANITIZE_STRING));
    if ($question_option['isCorrectAnswer'] !== true && $question_option['isCorrectAnswer'] !== false) {
      http_response_code(400);
      echo json_encode(["error" => "The 'isCorrectAnswer' field from one of the options isn't a bool. Did you tamper with the request?"]);
      die();
    }
  }
}

$quiz_id = generate_random_id(6);
$quiz_insert_query = "INSERT INTO quizzes (id, title, subject, tags, questions) VALUES (?,?,?,?,?)";
$stringified_questions = json_encode($questions);

$statement = mysqli_prepare($connection, $quiz_insert_query);
if (!mysqli_stmt_bind_param($statement, "sssss", $quiz_id, $title, $subject, $tags, $stringified_questions)) {
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
  echo json_encode(["error" => "There has been an error inserting the quiz into the database."]);
  die();
}


echo json_encode(["error" => null]);