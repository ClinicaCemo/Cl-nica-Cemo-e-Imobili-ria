<?php
// Limpa qualquer espaço ou caractere que tenha vazado na memória do servidor
if (ob_get_length()) ob_clean();

include("conexao.php");

$titulo = $_POST['titulo'];
$preco = $_POST['preco'];
$endereco = $_POST['endereco'];
$descricao = $_POST['descricao'];

$sql = "INSERT INTO imoveis
(titulo, preco, endereco, descricao)
VALUES
('$titulo', '$preco', '$endereco', '$descricao')";

if($conn->query($sql)){
    echo "Imóvel cadastrado com sucesso";
    exit; // Fecha o arquivo com segurança aqui
} else {
    echo "Erro ao cadastrar";
    exit; // Fecha o arquivo com segurança aqui também
}
?>