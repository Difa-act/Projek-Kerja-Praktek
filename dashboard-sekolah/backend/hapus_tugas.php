<?php

header("Content-Type: application/json");
include "koneksi.php";

$id = $_POST['id'] ?? '';

$query = mysqli_query($conn, "DELETE FROM tugas WHERE id='$id'");

echo json_encode([
    "success" => $query ? true : false
]);

?>