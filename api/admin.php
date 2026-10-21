<?php
declare(strict_types=1);

session_start();

// Só permite entrar se o login tiver sido validado pelo servidor.
if (empty($_SESSION['admin_id'])) {
    header('Location: login.html');
    exit;
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$csrfToken = htmlspecialchars(
    $_SESSION['csrf_token'],
    ENT_QUOTES,
    'UTF-8'
);
?><!DOCTYPE html><html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo | CEMO</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <main class="painel">
        <h1>Painel Administrativo CEMO</h1>
        <p>Área de gerenciamento de imóveis e avaliações.</p>    <section>
        <h2>Cadastro de imóvel</h2>

        <form id="form-cadastro">
            <input type="hidden" name="csrf_token"
                   value="<?= $csrfToken ?>">

            <label for="titulo">Título do imóvel</label>
            <input id="titulo" name="titulo" required>

            <label for="preco">Preço (R$)</label>
            <input id="preco" name="preco" type="number"
                   min="0" step="0.01" required>

            <label for="cidade">Cidade</label>
            <input id="cidade" name="cidade" required>

            <label for="descricao">Descrição</label>
            <textarea id="descricao" name="descricao"
                      rows="5" required></textarea>

            <button type="submit">Cadastrar imóvel</button>
        </form>

        <p id="cadastro-status" role="status"></p>
    </section>

    <section>
        <h2>Imóveis cadastrados</h2>
        <p id="imoveis-status">A lista será conectada na próxima etapa.</p>
        <div id="lista-imoveis"></div>
    </section>

    <form action="logout.php" method="post">
        <input type="hidden" name="csrf_token"
               value="<?= $csrfToken ?>">
        <button type="submit">Sair do painel</button>
    </form>
</main>

</body>
</html>