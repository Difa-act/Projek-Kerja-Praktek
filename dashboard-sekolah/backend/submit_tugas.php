<?php
header("Content-Type: application/json");
include "koneksi.php";

$tugas_id = $_POST['tugas_id'] ?? '';
$siswa_nis = $_POST['siswa_nis'] ?? '';
$jawaban = $_POST['jawaban'] ?? '';

$cek = mysqli_query($conn, "
    SELECT * FROM submission
    WHERE tugas_id='$tugas_id'
    AND siswa_nis='$siswa_nis'
");

if (mysqli_num_rows($cek) > 0) {
    $query = mysqli_query($conn, "
        UPDATE submission
        SET jawaban='$jawaban',
            submitted_at=CURRENT_TIMESTAMP,
            is_read_guru=0
        WHERE tugas_id='$tugas_id'
        AND siswa_nis='$siswa_nis'
    ");
} else {
    $query = mysqli_query($conn, "
        INSERT INTO submission (tugas_id, siswa_nis, jawaban, is_read_guru)
        VALUES ('$tugas_id', '$siswa_nis', '$jawaban', 0)
    ");
}

echo json_encode([
    "success" => $query ? true : false,
    "error" => $query ? null : mysqli_error($conn)
]);
?>