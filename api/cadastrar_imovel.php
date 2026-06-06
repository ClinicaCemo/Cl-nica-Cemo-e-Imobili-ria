<?php
// 1. Linhas de segurança para o navegador permitir a conexão (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Se for apenas uma checagem do navegador, o PHP para aqui com sucesso
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. Conecta com o seu banco de dados
include("conexao.php");

// 3. Pega os textos que o usuário digitou no formulário HTML
$titulo = $_POST['titulo'] ?? '';
$preco = $_POST['preco'] ?? '';
$endereco = $_POST['endereco'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$fotoNome = null;

// 4. Se o usuário enviou uma foto, salva ela na pasta do servidor
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    // Sobe um nível para achar a pasta "uploads" que fica junto com o HTML
    $pastaUpload = "../uploads/"; 
    
    if (!is_dir($pastaUpload)) {
        mkdir($pastaUpload, 0777, true); // Cria a pasta se ela não existir
    }

    $extensao = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    $fotoNome = time() . '.' . $extensao; // Cria um nome único usando o número do cronômetro atual
    $caminhoFinal = $pastaUpload . $fotoNome;

    move_uploaded_file($_FILES['foto']['tmp_name'], $caminhoFinal);
}

// 5. Salva as informações dentro da tabela do banco de dados
$sql = "INSERT INTO imoveis (titulo, preco, endereco, descricao, foto) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $titulo, $preco, $endereco, $descricao, $fotoNome);

if ($stmt->execute()) {
    echo "Imóvel cadastrado com sucesso!";
} else {
    echo "Erro ao cadastrar imóvel no banco de dados.";
}

$stmt->close();
$conn->close();
?>