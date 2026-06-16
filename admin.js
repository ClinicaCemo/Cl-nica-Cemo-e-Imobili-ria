const API = "api";

// CARREGA OS IMÓVEIS NA TABELA
async function carregarImoveis() {
    try {
        const resposta = await fetch(`${API}/listar_imoveis.php`);
        const imoveis = await resposta.json();

        // CARD TOTAL DE IMÓVEIS
        const totalImoveis = document.getElementById("total-imoveis");
        if (totalImoveis) {
            totalImoveis.textContent = imoveis.length;
        }

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

// FUNÇÃO QUE CADASTRA UM NOVO IMÓVEL
async function cadastrarImovel() {
    const titulo = document.getElementById("titulo").value;
    const preco = document.getElementById("preco").value;
    const endereco = document.getElementById("endereco").value;
    const descricao = document.getElementById("descricao").value;
    const foto = document.getElementById("foto")?.files?.[0];

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("preco", preco);
    formData.append("endereco", endereco);
    formData.append("descricao", descricao);

    if (foto) {
        formData.append("foto", foto);
    }

    try {
        const resposta = await fetch(`${API}/cadastrar_imovel.php`, {
            method: "POST",
            body: formData
        });

        await resposta.text();

        document.getElementById("form-cadastro").reset();

        window.location.reload();

    } catch (error) {
        console.log(error);
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

        // CARD TOTAL DE AVALIAÇÕES
        const totalAvaliacoes = document.getElementById("total-avaliacoes");
        if (totalAvaliacoes) {
            totalAvaliacoes.textContent = avaliacoes.length;
        }

        // NOTA MÉDIA
        const notaMedia = document.getElementById("nota-media");
        if (notaMedia && avaliacoes.length > 0) {
            const soma = avaliacoes.reduce((acc, item) => {
                return acc + Number(item.nota || 0);
            }, 0);

            const media = (soma / avaliacoes.length).toFixed(1);
            notaMedia.textContent = `${media} ⭐`;
        }

        // CLIENTES SATISFEITOS
        const clientesSatisfeitos =
            document.getElementById("clientes-satisfeitos");

        if (clientesSatisfeitos && avaliacoes.length > 0) {
            const satisfeitos = avaliacoes.filter(item =>
                Number(item.nota) >= 4
            ).length;

            const porcentagem =
                Math.round((satisfeitos / avaliacoes.length) * 100);

            clientesSatisfeitos.textContent =
                `${porcentagem}%`;
        }

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
        document.getElementById("descricao-clinica")?.value;

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

window.onload = () => {
    carregarImoveis();
    carregarAvaliacoes();
};