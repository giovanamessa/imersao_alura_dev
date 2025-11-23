const cardContainer = document.querySelector(".card-container");
const campoBusca = document.getElementById("campo-busca");
const filtroCategoria = document.getElementById("filtro-categoria");
const botaoBusca = document.getElementById("botao-busca");
const botaoTema = document.getElementById("toggle-tema");

const modal = document.getElementById("modal-alerta");
const mensagemModal = document.getElementById("mensagem-modal");
const fecharModal = document.getElementById("fechar-modal");

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

function abrirModal(msg) {
  mensagemModal.textContent = msg;
  modal.style.display = "flex";
}

let dados = [];

async function carregarDados() {
  const resposta = await fetch("data.json");
  dados = await resposta.json();
}

function normalizar(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filtrarBusca(query, categoria) {
  const termo = normalizar(query);

  return dados
    .filter(f => {
      const nomeEN = normalizar(f.nome);
      const nomePT = normalizar(f.nomePT || "");
      const matchNome = nomePT.includes(termo) || nomeEN.includes(termo);
      const matchCategoria = categoria ? f.categoria === categoria : true;
      return matchNome && matchCategoria;
    })
    .slice(0, 20);
}

function renderizarCards(lista) {
  cardContainer.innerHTML = "";

  if (!lista.length) {
    cardContainer.innerHTML = `<p class="msg-info">Nenhum resultado encontrado.</p>`;
    return;
  }

  for (const filme of lista) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h2>${filme.nome} <span class="ano">(${filme.ano})</span></h2>
      <p>${filme.descricao}</p>
      <a href="${filme.link}" target="_blank">Saiba Mais</a>
    `;

    cardContainer.appendChild(card);
  }
}

botaoBusca.addEventListener("click", () => {
  const texto = campoBusca.value.trim();
  const categoria = filtroCategoria.value;

  if (texto.length < 2) {
    abrirModal("Por favor, digite no mínimo 2 caracteres para pesquisar.");
    return;
  }

  const resultados = filtrarBusca(texto, categoria);
  renderizarCards(resultados);
});

botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  botaoTema.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

carregarDados();
