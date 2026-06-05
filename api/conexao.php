<?php
$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "cemo";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>s