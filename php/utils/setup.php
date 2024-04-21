<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$ALLOWED_SERVER_ORIGIN = "http://localhost:5173";

header("Access-Control-Allow-Origin: {$ALLOWED_SERVER_ORIGIN}");
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Credentials: true");
header('Content-Type: "application/json"');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === "OPTIONS") {
  header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
  exit(0);
}

// sending JSON does not work as expected with $_POST.
$_POST = json_decode(file_get_contents('php://input'), true);