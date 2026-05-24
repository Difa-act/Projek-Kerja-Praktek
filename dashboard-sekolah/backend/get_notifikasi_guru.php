<?php
header("Content-Type: application/json");
include "koneksi.php";

$created_by = $_GET['created_by'] ?? '';

$query = mysqli_query($conn, "
    SELECT 
        submission.id AS submission_id,
        submission.tugas_id,
        submission.siswa_nis,
        submission.jawaban,
        submission.submitted_at,
        submission.is_read_guru,
        tugas.judul,
        tugas.mapel,
        tugas.kelas,
        siswa.nama AS nama_siswa
    FROM submission
    INNER JOIN tugas 
        ON submission.tugas_id = tugas.id
    LEFT JOIN siswa 
        ON submission.siswa_nis = siswa.nis
    WHERE tugas.created_by = '$created_by'
    ORDER BY submission.submitted_at DESC
");

$data = [];

while ($row = mysqli_fetch_assoc($query)) {
    $data[] = $row;
}

echo json_encode($data);
?>