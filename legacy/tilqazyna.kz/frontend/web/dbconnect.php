<?php 

$servername = "127.0.0.1";
$username = "tilalemi";
$password = "Til23serv";
$dbname = "tilalemi";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_set_charset($conn, "utf8"); /* Procedural approach */
$conn->set_charset("utf8");        /* Object-oriented approach */
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>