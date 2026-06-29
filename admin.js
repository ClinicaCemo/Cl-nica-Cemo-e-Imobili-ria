const API = "api";

// CARREGA OS IMÓVEIS NA TABELA
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
                </tr>
            `;
        });

    } catch (error) {
        console.log(error);
        console.error("Erro ao carregar imóveis do banco.");
    }
}

// FUNÇÃO QUE CADASTRA UM NOVO IMÓVEL
async function cadastrarImovel() {

    const titulo = document.getElementById("titulo").value;
    const preco = document.getElementById("preco").value;
    const endereco = document.getElementById("endereco").value;
    const descricao = document.getElementById("descricao").value;
    const arquivo = document.getElementById("midia").files[0];

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("preco", preco);
    formData.append("endereco", endereco);
    formData.append("descricao", descricao);

    if (arquivo) {
        formData.append("midia", arquivo);
    }

    try {

        const resposta = await fetch(
            "api/cadastrar_imovel.php",
            {
                method: "POST",
                body: formData
            }
        );

        const texto = await resposta.text();

        console.log(texto);
        alert(texto);

        document.getElementById("form-cadastro").reset();

    } catch (erro) {

        console.log(erro);
        alert("Erro ao enviar.");

    }
}
// FUNÇÃO QUE EXCLUI UM IMÓVEL
async function excluirImovel(id) {
    if (!confirm("Deseja excluir este imóvel?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/excluir_imovel.php?id=${id}`, {
            method: "GET"
        });

        await resposta.text();


        window.location.reload();

    } catch (error) {
        console.log(error);
    }
}

// CARREGAR AS AVALIAÇÕES DOS CLIENTES
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

async function carregarDashboard() {

    try {

        const respImoveis =
            await fetch(`${API}/listar_imoveis.php`);

        const imoveis =
            await respImoveis.json();

        const respAvaliacoes =
            await fetch(`${API}/listar_avaliacoes.php`);

        const avaliacoes =
            await respAvaliacoes.json();

        document.getElementById("total-imoveis").innerText =
            imoveis.length;

        document.getElementById("total-avaliacoes").innerText =
            avaliacoes.length;

        let media = 0;

        if (avaliacoes.length > 0) {

            const soma = avaliacoes.reduce(
                (total, item) =>
                    total + Number(item.nota),
                0
            );

            media = soma / avaliacoes.length;
        }

        document.getElementById("nota-media").innerText =
            media.toFixed(1) + " ⭐";

        const satisfeitos =
            avaliacoes.length > 0
            ? (avaliacoes.filter(
                a => Number(a.nota) >= 4
              ).length /
              avaliacoes.length) * 100
            : 0;

        document.getElementById("clientes-satisfeitos").innerText =
            satisfeitos.toFixed(0) + "%";

    } catch (erro) {

        console.log("Erro dashboard:", erro);

    }

}

window.onload = () => {
    carregarImoveis();
    carregarAvaliacoes();
    carregarDashboard();
};
