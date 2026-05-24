<?php

header("Content-Type: application/json");
include "koneksi.php";

$id = $_POST['id'] ?? '';
$judul = $_POST['judul'] ?? '';
$deskripsi = $_POST['deskripsi'] ?? '';
$kelas = $_POST['kelas'] ?? '';
$deadline = $_POST['deadline'] ?? '';

$query = mysqli_query($conn, "
    UPDATE tugas 
    SET 
        judul='$judul',
        deskripsi='$deskripsi',
        kelas='$kelas',
        deadline='$deadline'
    WHERE id='$id'
");

echo json_encode([
    "success" => $query ? true : false
]);

?>