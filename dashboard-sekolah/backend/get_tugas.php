<?php
header("Content-Type: application/json");
include "koneksi.php";

$query = mysqli_query($conn, "SELECT * FROM tugas ORDER BY id DESC");

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
    $data[] = $row;
}

echo json_encode($data);
?>