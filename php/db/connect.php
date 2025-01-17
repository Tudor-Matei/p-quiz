<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "pquiz";
$connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
if ($connection === false) {
  echo json_encode(["error" => "Failed to connect to database."]);
  die();
}