<?php
header("Content-Type: application/json");
include "koneksi.php";

$judul = $_POST['judul'] ?? '';
$mapel = $_POST['mapel'] ?? '';
$deskripsi = $_POST['deskripsi'] ?? '';
$kelas = $_POST['kelas'] ?? '';
$deadline = $_POST['deadline'] ?? '';
$created_by = $_POST['created_by'] ?? '';

$query = mysqli_query($conn, "
    INSERT INTO tugas (judul, mapel, deskripsi, kelas, deadline, created_by)
    VALUES ('$judul', '$mapel', '$deskripsi', '$kelas', '$deadline', '$created_by')
");

echo json_encode([
    "success" => $query ? true : false,
    "error" => $query ? null : mysqli_error($conn)
]);
?>