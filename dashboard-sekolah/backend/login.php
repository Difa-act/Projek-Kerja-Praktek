<?php

header("Content-Type: application/json");

include "koneksi.php";

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$query = mysqli_query($conn, "
    SELECT * FROM users
    WHERE username='$username'
    AND password='$password'
");

$data = mysqli_fetch_assoc($query);

if ($data) {

    echo json_encode([
        "success" => true,
        "role" => $data['role'],
        "username" => $data['username']
    ]);

} else {

    echo json_encode([
        "success" => false,
        "debug_username" => $username,
        "debug_password" => $password
    ]);

}
?>