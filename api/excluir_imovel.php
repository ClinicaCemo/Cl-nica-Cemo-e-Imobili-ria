<?php

include("conexao.php");

$id = $_GET['id'];

$sql = "DELETE FROM imoveis WHERE id = $id";

if($conn->query($sql)){
    echo "Imóvel excluído com sucesso";
}else{
    echo "Erro ao excluir";
}

?>