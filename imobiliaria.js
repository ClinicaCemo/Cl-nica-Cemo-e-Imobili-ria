
/* CEMO IMOBILIÁRIA — JAVASCRIPT */

const API_LISTAR = "listar_imoveis.php";
const WHATSAPP_CEMO = "5538991361872";

let todosImoveis = [];

const $ = id => document.getElementById(id);

const normalizar = valor =>
  String(valor ?? "").trim().toLocaleLowerCase("pt-BR");

const escapar = valor =>
  String(valor ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

function campo(imovel, nomes) {
  for (const nome of nomes) {
    if (
      imovel?.[nome] !== undefined &&
      imovel[nome] !== null &&
      imovel[nome] !== ""
    ) {
      return imovel[nome];
    }
  }
  return "";
}

function numeroPreco(valor) {
  if (typeof valor === "number") return valor;

  const limpo = String(valor ?? "")
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : 0;
}

function moeda(valor) {
  return numeroPreco(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2
  });
}

function formatoNegocio(imovel) {
  const valor = normalizar(campo(imovel, [
    "negocio",
    "finalidade",
    "tipo_negocio",
    "operacao"
  ]));

  if (valor.includes("alug") || valor.includes("loca")) {
    return "aluguel";
  }

  if (valor.includes("vend") || valor.includes("compra")) {
    return "venda";
  }

  return normalizar(imovel?.aluguel) === "true"
    ? "aluguel"
    : "venda";
}

function formatoTipo(imovel) {
  return normalizar(campo(imovel, [
    "tipo_imovel",
    "tipo",
    "categoria"
  ])) || "outro";
}

function urlFoto(imovel) {
  const nome = campo(imovel, [
    "foto",
    "imagem",
    "arquivo_foto"
  ]);

  if (!nome) return "";

  if (
    /^https?:\/\//i.test(nome) ||
    String(nome).startsWith("/")
  ) {
    return nome;
  }

  return "uploads/" + String(nome).replace(/^uploads\//, "");
}

function montarCartao(imovel) {
  const titulo =
    campo(imovel, ["titulo", "nome"]) || "Imóvel disponível";

  const cidade = campo(imovel, ["cidade"]) || "Pirapora";
  const bairro = campo(imovel, ["bairro"]);
  const endereco = campo(imovel, ["endereco", "localizacao"]);
  const local = [bairro, cidade].filter(Boolean).join(" · ") || endereco;

  const preco = campo(imovel, ["preco", "valor"]);
  const negocio = formatoNegocio(imovel);
  const tipo = formatoTipo(imovel);

  const descricao =
    campo(imovel, ["descricao", "detalhes"]) ||
    "Entre em contato para saber mais sobre este imóvel.";

  const foto = urlFoto(imovel);

  const quartos = campo(imovel, ["quartos", "qtd_quartos"]);
  const banheiros = campo(imovel, ["banheiros", "qtd_banheiros"]);
  const vagas = campo(imovel, ["vagas", "garagem"]);
  const id = campo(imovel, ["id", "id_imovel"]);

  const mensagem = encodeURIComponent(
    `Olá! Gostaria de mais informações sobre o imóvel "${titulo}"` +
    `${id ? ` (código ${id})` : ""}, em ${local}.`
  );

  let midia = "";

  if (foto && /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(foto)) {
    midia = `
      <video
        src="${escapar(foto)}"
        muted
        playsinline
        preload="metadata"
        aria-label="${escapar(titulo)}"
        data-midia="${escapar(foto)}"
      ></video>`;
  } else {
    midia = `
      <img
        src="${escapar(foto || "assets/sem-foto.jpg")}"
        alt="${escapar(titulo)}"
        loading="lazy"
        onerror="this.onerror=null;this.src='assets/sem-foto.jpg'"
      >`;
  }

  const detalhes = [
    quartos !== "" ? `${escapar(quartos)} quarto(s)` : "",
    banheiros !== "" ? `${escapar(banheiros)} banheiro(s)` : "",
    vagas !== "" ? `${escapar(vagas)} vaga(s)` : ""
  ]
    .filter(Boolean)
    .map(item => `<span>${item}</span>`)
    .join("");

  return `
    <article class="imovel-card">
      <div class="imovel-foto">
        ${midia}
        <span class="etiqueta">
          ${negocio === "aluguel" ? "PARA ALUGAR" : "À VENDA"}
        </span>
      </div>

      <div class="imovel-corpo">
        <h3>${escapar(titulo)}</h3>

        <p class="imovel-local">
          📍 ${escapar(local || "Consulte a localização")}
        </p>

        <p class="imovel-descricao">
          ${escapar(descricao)}
        </p>

        <div class="imovel-detalhes">
          <span>${escapar(tipo)}</span>
          ${detalhes}
        </div>

        <div class="imovel-preco">
          ${preco !== "" ? moeda(preco) : "Consulte o preço"}
        </div>

        <a
          class="btn-whatsapp"
          href="https://wa.me/${WHATSAPP_CEMO}?text=${mensagem}"
          target="_blank"
          rel="noopener"
        >
          Falar sobre este imóvel ↗
        </a>
      </div>
    </article>
  `;
}

function preencherOpcoes(select, valores, textoInicial) {
  const atual = select.value;

  const unicos = [
    ...new Set(
      valores
        .map(valor => String(valor || "").trim())
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  select.innerHTML =
    `<option value="">${textoInicial}</option>` +
    unicos.map(valor =>
      `<option value="${escapar(valor)}">${escapar(valor)}</option>`
    ).join("");

  if (unicos.includes(atual)) {
    select.value = atual;
  }
}

function atualizarFiltrosLocais() {
  const cidade = $("filtro-cidade").value;

  const porCidade = todosImoveis.filter(imovel =>
    !cidade ||
    normalizar(campo(imovel, ["cidade"])) === normalizar(cidade)
  );

  const bairroAtual = $("filtro-bairro").value;

  preencherOpcoes(
    $("filtro-bairro"),
    porCidade.map(imovel => campo(imovel, ["bairro"])),
    "Todos os bairros"
  );

  if (
    [...$("filtro-bairro").options].some(
      opcao => normalizar(opcao.value) === normalizar(bairroAtual)
    )
  ) {
    $("filtro-bairro").value = bairroAtual;
  }
}

function aplicarFiltros(evento) {
  if (evento) evento.preventDefault();

  const negocio = $("filtro-negocio").value;
  const tipo = normalizar($("filtro-tipo").value);
  const cidade = normalizar($("filtro-cidade").value);
  const bairro = normalizar($("filtro-bairro").value);

  const minimo = $("filtro-min").value === ""
    ? null
    : Number($("filtro-min").value);

  const maximo = $("filtro-max").value === ""
    ? null
    : Number($("filtro-max").value);

  const ordem = $("filtro-ordem").value;

  let lista = todosImoveis.filter(imovel => {
    const preco = numeroPreco(campo(imovel, ["preco", "valor"]));

    return (
      (negocio === "todos" || formatoNegocio(imovel) === negocio) &&
      (!tipo || formatoTipo(imovel) === tipo) &&
      (!cidade || normalizar(campo(imovel, ["cidade"])) === cidade) &&
      (!bairro || normalizar(campo(imovel, ["bairro"])) === bairro) &&
      (minimo === null || preco >= minimo) &&
      (maximo === null || preco <= maximo)
    );
  });

  if (ordem === "menor") {
    lista.sort((a, b) =>
      numeroPreco(campo(a, ["preco", "valor"])) -
      numeroPreco(campo(b, ["preco", "valor"]))
    );
  }

  if (ordem === "maior") {
    lista.sort((a, b) =>
      numeroPreco(campo(b, ["preco", "valor"])) -
      numeroPreco(campo(a, ["preco", "valor"]))
    );
  }

  $("texto-resultados").textContent =
    `${lista.length} ${lista.length === 1
      ? "imóvel encontrado"
      : "imóveis encontrados"}`;

  $("lista-imoveis-site").innerHTML = lista.length
    ? lista.map(montarCartao).join("")
    : `
      <div class="estado-vazio">
        Nenhum imóvel corresponde aos filtros escolhidos.
        <br>
        Tente mudar a cidade, o bairro ou a faixa de preço.
      </div>
    `;

  document.querySelectorAll(".imovel-foto video").forEach(video => {
    video.addEventListener("click", () =>
      abrirMidia(video.dataset.midia, true)
    );

    video.addEventListener("mouseenter", () =>
      video.play().catch(() => {})
    );

    video.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  document.querySelectorAll(".imovel-foto img").forEach(img => {
    img.addEventListener("click", () =>
      abrirMidia(img.currentSrc || img.src, false)
    );
  });
}

async function carregarImoveis() {
  const container = $("lista-imoveis-site");

  try {
    const resposta = await fetch(API_LISTAR, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });

    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("O PHP não retornou uma lista JSON.");
    }

    todosImoveis = dados;

    $("contador-total").textContent = String(dados.length);

    preencherOpcoes(
      $("filtro-cidade"),
      dados.map(imovel => campo(imovel, ["cidade"])),
      "Todas as cidades"
    );

    atualizarFiltrosLocais();
    aplicarFiltros();

  } catch (erro) {
    console.error("Erro ao carregar imóveis:", erro);

    $("contador-total").textContent = "—";
    $("texto-resultados").textContent = "Lista indisponível";

    container.innerHTML = `
      <div class="estado-vazio">
        Não foi possível carregar os imóveis.
        <br>
        Verifique se o site está aberto pelo XAMPP e se
        <strong>${API_LISTAR}</strong> existe e retorna JSON válido.
      </div>
    `;
  }
}

/* MENU HAMBÚRGUER */

function abrirMenu() {
  $("menu-lateral").classList.add("aberto");
  $("menu-lateral").setAttribute("aria-hidden", "false");
  $("abrir-menu").setAttribute("aria-expanded", "true");
  $("fundo-menu").hidden = false;
  document.body.style.overflow = "hidden";
}

function fecharMenu() {
  $("menu-lateral").classList.remove("aberto");
  $("menu-lateral").setAttribute("aria-hidden", "true");
  $("abrir-menu").setAttribute("aria-expanded", "false");
  $("fundo-menu").hidden = true;
  document.body.style.overflow = "";
}

/* FOTOS E VÍDEOS AMPLIADOS */

function abrirMidia(src, video) {
  const conteudo = $("conteudo-popup");

  conteudo.innerHTML = video
    ? `<video controls autoplay playsinline src="${escapar(src)}"></video>`
    : `<img src="${escapar(src)}" alt="Foto ampliada do imóvel">`;

  $("popup-final").classList.add("aberto");
  $("popup-final").setAttribute("aria-hidden", "false");
}

function fecharMidia() {
  const popup = $("popup-final");
  const video = $("conteudo-popup").querySelector("video");

  if (video) video.pause();

  $("conteudo-popup").innerHTML = "";
  popup.classList.remove("aberto");
  popup.setAttribute("aria-hidden", "true");
}

/* IDIOMA DA NAVEGAÇÃO */

const traducoes = {
  "pt-BR": {
    "nav-imoveis": "Imóveis",
    "nav-sobre": "Sobre",
    "nav-anuncie": "Anuncie seu imóvel",
    "nav-contato": "Contato"
  },
  en: {
    "nav-imoveis": "Properties",
    "nav-sobre": "About",
    "nav-anuncie": "List your property",
    "nav-contato": "Contact"
  },
  es: {
    "nav-imoveis": "Propiedades",
    "nav-sobre": "Nosotros",
    "nav-anuncie": "Anuncie su inmueble",
    "nav-contato": "Contacto"
  }
};

function trocarIdioma(valor) {
  const chaves = [
    "nav-imoveis",
    "nav-sobre",
    "nav-anuncie",
    "nav-contato"
  ];

  document.querySelectorAll(".nav-desktop a").forEach((link, indice) => {
    const chave = chaves[indice];

    if (traducoes[valor]?.[chave]) {
      link.textContent = traducoes[valor][chave];
    }
  });

  $("idioma").value = valor;
  $("idioma-menu").value = valor;
}

/* INICIALIZAÇÃO */

document.addEventListener("DOMContentLoaded", () => {
  $("ano-atual").textContent = new Date().getFullYear();

  $("abrir-menu").addEventListener("click", abrirMenu);
  $("fechar-menu").addEventListener("click", fecharMenu);
  $("fundo-menu").addEventListener("click", fecharMenu);

  document.querySelectorAll("[data-close-menu]").forEach(link => {
    link.addEventListener("click", fecharMenu);
  });

  $("form-filtros").addEventListener("submit", aplicarFiltros);

  $("filtro-cidade").addEventListener("change", () => {
    atualizarFiltrosLocais();
    aplicarFiltros();
  });

  [
    "filtro-negocio",
    "filtro-tipo",
    "filtro-bairro",
    "filtro-ordem"
  ].forEach(id => {
    $(id).addEventListener("change", aplicarFiltros);
  });

  ["filtro-min", "filtro-max"].forEach(id => {
    $(id).addEventListener("input", aplicarFiltros);
  });

  $("limpar-filtros").addEventListener("click", () => {
    $("form-filtros").reset();
    atualizarFiltrosLocais();
    aplicarFiltros();
  });

  $("fechar-popup").addEventListener("click", fecharMidia);

  $("popup-final").addEventListener("click", evento => {
    if (evento.target === $("popup-final")) {
      fecharMidia();
    }
  });

  document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
      fecharMenu();
      fecharMidia();
    }
  });

  $("idioma").addEventListener("change", evento =>
    trocarIdioma(evento.target.value)
  );

  $("idioma-menu").addEventListener("change", evento =>
    trocarIdioma(evento.target.value)
  );

  $("aceitar-cookies").addEventListener("click", () => {
    $("cookies").hidden = true;
  });

  carregarImoveis();
});