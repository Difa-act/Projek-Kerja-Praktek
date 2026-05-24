<?php
header("Content-Type: application/json");
include "koneksi.php";

$created_by = $_POST['created_by'] ?? '';

$query = mysqli_query($conn, "
    UPDATE submission
    INNER JOIN tugas ON submission.tugas_id = tugas.id
    SET submission.is_read_guru = 1
    WHERE tugas.created_by = '$created_by'
");

echo json_encode([
    "success" => $query ? true : false,
    "error" => $query ? null : mysqli_error($conn)
]);
?>