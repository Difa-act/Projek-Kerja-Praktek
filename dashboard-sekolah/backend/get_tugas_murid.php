<?php
header("Content-Type: application/json");
include "koneksi.php";

$nis = $_GET['nis'] ?? '';

$qSiswa = mysqli_query($conn, "
    SELECT * FROM siswa
    WHERE nis='$nis'
");

$siswa = mysqli_fetch_assoc($qSiswa);

if (!$siswa) {
    echo json_encode([]);
    exit;
}

$kelas = $siswa['kelas'];

$query = mysqli_query($conn, "
    SELECT 
        tugas.id,
        tugas.judul,
        tugas.mapel,
        tugas.deskripsi,
        tugas.kelas,
        tugas.deadline,
        tugas.created_at,
        tugas.created_by,
        users.nama AS nama_guru,
        submission.id AS submission_id
    FROM tugas
    LEFT JOIN users 
        ON tugas.created_by = users.username
    LEFT JOIN submission 
        ON submission.tugas_id = tugas.id
        AND submission.siswa_nis = '$nis'
    WHERE tugas.kelas = '$kelas'
    ORDER BY tugas.created_at DESC
");

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
    $data[] = $row;
}

echo json_encode($data);
?>