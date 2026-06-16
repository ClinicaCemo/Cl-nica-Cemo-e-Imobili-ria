<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include("conexao.php");

$descricao = $_POST['descricao'] ?? '';

$sql = "UPDATE dados_clinica SET descricao='$descricao' WHERE id=1";

if ($conn->query($sql)) {
    echo "sucesso";
} else {
    echo "ERRO MYSQL: " . $conn->error;
