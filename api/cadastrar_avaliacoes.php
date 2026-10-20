<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("conexao.php");

$nome = $_POST["nome"] ?? "";
$email = $_POST["email"] ?? "";
$nota = $_POST["nota"] ?? "";
$comentario = $_POST["comentario"] ?? "";

$stmt = $conn->prepare(
    "INSERT INTO avaliacoes
    (nome,email,nota,comentario)
    VALUES (?,?,?,?)"
);

$stmt->bind_param(
    "ssis",
    $nome,
    $email,
    $nota,
    $comentario
);

if($stmt->execute()){
    echo "OK";
}else{
    echo "ERRO";
}
?>