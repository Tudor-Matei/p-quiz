<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'utils/Key.php';
include_once 'db/UserKeys.php';
include_once 'utils/is_logged_in.php';

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

$user_id = Key::decode($_COOKIE['user_key']);
if ($user_id === false) {
  http_response_code(401);
  echo json_encode(["error" => "Invalid user key."]);
  die();
}

$user_role_query = "SELECT role FROM users WHERE id = ?";
$user_role_statement = mysqli_prepare($connection, $user_role_query);
mysqli_stmt_bind_param($user_role_statement, 's', $user_id);

if (!mysqli_execute($user_role_statement)) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error executing the query."]);
  die();
}

$user_role_result = mysqli_stmt_get_result($user_role_statement);
$user_role_row = mysqli_fetch_assoc($user_role_result);
$user_role = $user_role_row['role'];

$response_data = [];

if ($user_role === 'teacher') {
  $quizzes_query = "SELECT q.*, COUNT(CASE WHEN u.role = 'student' THEN 1 END) AS student_attempts
                    FROM quizzes q
                    LEFT JOIN attempts a ON q.id = a.quiz_id
                    LEFT JOIN users u ON a.user_id = u.id
                    WHERE q.author_id = ?
                    GROUP BY q.id;";
  $quizzes_statement = mysqli_prepare($connection, $quizzes_query);
  mysqli_stmt_bind_param($quizzes_statement, 's', $user_id);

  if (!mysqli_execute($quizzes_statement)) {
    http_response_code(500);
    echo json_encode(["error" => "There's been an error executing the query."]);
    die();
  }

  $quizzes_result = mysqli_stmt_get_result($quizzes_statement);
  $quizzes = [];
  while ($row = mysqli_fetch_assoc($quizzes_result)) {
    $quizzes[] = $row;
  }
  $response_data['quizzes'] = $quizzes;
} elseif ($user_role === 'student') {
  $attempts_query = "SELECT a.*, q.title AS quiz_title, q.id AS quiz_id
                     FROM attempts a
                     LEFT JOIN quizzes q ON a.quiz_id = q.id
                     WHERE a.user_id = ?;";
  $attempts_statement = mysqli_prepare($connection, $attempts_query);
  mysqli_stmt_bind_param($attempts_statement, 's', $user_id);

  if (!mysqli_execute($attempts_statement)) {
    http_response_code(500);
    echo json_encode(["error" => "There's been an error executing the query."]);
    die();
  }

  $attempts_result = mysqli_stmt_get_result($attempts_statement);
  $attempts = [];
  while ($row = mysqli_fetch_assoc($attempts_result)) {
    $attempts[] = $row;
  }

  $response_data['attempts'] = $attempts;
}


$random_quiz_query = "SELECT * FROM quizzes ORDER BY RAND() LIMIT 1;";
$random_quiz_statement = mysqli_prepare($connection, $random_quiz_query);

if (!mysqli_execute($random_quiz_statement)) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error executing the query."]);
  die();
}

$random_quiz_result = mysqli_stmt_get_result($random_quiz_statement);
$random_quiz_row = mysqli_fetch_assoc($random_quiz_result);
$response_data['random_quiz'] = $random_quiz_row;

http_response_code(200);
echo json_encode($response_data);
?>