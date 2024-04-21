<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'utils/email_regex.php';
include_once 'utils/generate_random_id.php';
include_once 'utils/get_email.php';
include_once 'db/UserKeys.php';
include_once 'utils/Key.php';
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

$delete_user_key_status = UserKeys::delete($_COOKIE['user_key'], $connection);

if (isset($delete_user_key_status['error'])) {
  http_response_code(500);
  echo json_encode($delete_user_key_status['error']);
  die();
}

if (!setcookie("user_key", "")) {
  http_response_code(500);
  echo json_encode(["error" => "Could not delete the user_key from the cookies."]);
  die();
}

echo json_encode(["error" => null]);