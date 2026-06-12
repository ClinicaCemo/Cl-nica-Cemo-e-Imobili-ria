<?php
// Impede qualquer caractere de vazar para a tela antes da hora
if (ob_get_length()) ob_clean();

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "cemo"; 

$conn = new mysqli($host, $user, $pass, $dbname);

// Configura a conexão para aceitar acentos (ç, á, ó) perfeitamente
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}
?>