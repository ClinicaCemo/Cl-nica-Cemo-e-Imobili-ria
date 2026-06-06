<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include("conexao.php");

$id = $_GET['id'];

$sql = "DELETE FROM imoveis WHERE id = $id";

if($conn->query($sql)){
    echo "Imóvel excluído com sucesso";
}else{
    echo "Erro ao excluir";
}

?>