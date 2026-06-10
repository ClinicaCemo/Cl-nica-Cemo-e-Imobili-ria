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
    const titulo = document.getElementById("titulo").value;
    const preco = document.getElementById("preco").value;
    const endereco = document.getElementById("endereco").value;
    const descricao = document.getElementById("descricao").value;
    const midia = document.getElementById("midia").files[0];

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("preco", preco);
    formData.append("endereco", endereco);
    formData.append("descricao", descricao);

    if (midia) {
        formData.append("midia", midia);
    }

    try {
        const resposta = await fetch("api/cadastrar_imovel.php", {
            method: "POST",
            body: formData
        });

        const resultado = await resposta.text();

        console.log(resultado);
        alert(resultado);

    } catch (error) {
        console.log(error);
    }
}

// 4. FUNÇÃO QUE CARREGA AS AVALIAÇÕES DOS CLIENTES
async function carregarAvaliacoes() {
    try {
        const resposta = await fetch(`${API}/listar_avaliacoes.php`);
        const avaliacoes = await resposta.json();

        // Procura a tabela de avaliações pelo ID correto
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
        console.error("Erro ao carregar avaliações do banco.");
    }
}

async function salvarClinica() {

    const texto =
        document.getElementById("descricao-clinica").value;

    const formData = new FormData();

    formData.append("descricao", texto);

    try {

        const resposta = await fetch(
            "api/salvar_clinica.php",
            {
                method: "POST",
                body: formData
            }
        );

        const resultado = await resposta.text();

        console.log(resultado);

if (resultado.includes("sucesso")) { 
            alert("Alterações salvas com sucesso!");
        } else {
            alert("Erro ao salvar.");
        }

    } catch (erro) {
        console.log(erro);
        alert("Erro de conexão.");
    }
}

// 5. SE DETERMINA QUE TUDO COMEÇA ASSIM QUE A PÁGINA ABRE
window.onload = () => {
    carregarImoveis();
    carregarAvaliacoes();
};