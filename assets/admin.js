const API = "api";

// 1. FUNÇÃO QUE CARREGA OS IMÓVEIS NA TABELA
async function carregarImoveis() {
    try {
        const resposta = await fetch(`${API}/listar_imoveis.php`);
        const imoveis = await resposta.json();

        const tabela = document.getElementById("lista-imoveis");
        if (!tabela) return;

        tabela.innerHTML = "";

        imoveis.forEach(imovel => {
            tabela.innerHTML += `
                <tr>
                    <td>${imovel.id}</td>
                    <td>${imovel.titulo}</td>
                    <td>${imovel.preco}</td>
                    <td>
                        <button onclick="excluirImovel(${imovel.id})" class="excluir">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log(error);
        console.error("Erro ao carregar imóveis do banco.");
    }
}

// 2. FUNÇÃO QUE CADASTRA UM NOVO IMÓVEL
async function cadastrarImovel() {
    // Pegando os valores da tela usando os IDs corretos do HTML
    const titulo = document.getElementById("titulo").value;
    const preco = document.getElementById("preco").value;
    const endereco = document.getElementById("endereco").value;
    const descricao = document.getElementById("descricao").value;
    const foto = document.getElementById("foto").files[0];

    // Montando a caixinha de dados limpa para o PHP ler
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("preco", preco);
    formData.append("endereco", endereco);
    formData.append("descricao", descricao);

    if (foto) {
        formData.append("foto", foto);
    }

    try {
        // [REMOVIDO] Tiramos o "Enviando para o PHP..." antigo daqui para não travar mais a tela!

        const resposta = await fetch(`${API}/cadastrar_imovel.php`, {
            method: "POST",
            body: formData
        });

        const resultado = await resposta.text();
        //alert("Resposta do servidor: " + resultado);

        // Limpa o formulário após cadastrar com sucesso
        document.getElementById("form-cadastro").reset();
        
        // [ADICIONADO] Recarrega a página para puxar os dados atualizados do MySQL
        window.location.reload();

    } catch (error) {
        console.log(error);
       // alert("Erro ao conectar com o servidor PHP.");
    }
}

// 3. FUNÇÃO QUE EXCLUI UM IMÓVEL
async function excluirImovel(id) {
    if (!confirm("Deseja excluir este imóvel?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/excluir_imovel.php?id=${id}`, {
            method: "GET"
        });

        const resultado = await resposta.text();
        alert(resultado);

        // Recarrega a página após excluir para sumir da tabela na hora
        window.location.reload();

    } catch (error) {
        console.log(error);
        //alert("Erro ao tentar excluir o imóvel.");
    }
}

// 4. FUNÇÃO QUE CARREGA AS AVALIAÇÕES DOS CLIENTES
async function carregarAvaliacoes() {
    try {
        const resposta = await fetch(`${API}/listar_avaliacoes.php`);
        const avaliacoes = await resposta.json();

        const tabela = document.getElementById("lista-avaliacoes");
        if (!tabela) return;

        tabela.innerHTML = "";

        avaliacoes.forEach(item => {
            tabela.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.nota}</td>
                    <td>${item.comentario}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log(error);
    }
}

// 5. SE DETERMINA QUE TUDO COMEÇA ASSIM QUE A PÁGINA ABRE
window.onload = () => {
    carregarImoveis();
    carregarAvaliacoes();
};