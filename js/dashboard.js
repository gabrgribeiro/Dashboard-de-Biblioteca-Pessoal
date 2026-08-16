let livros = carregarLivros();

const totalLivros = document.getElementById("totalLivros");
const totalLidos = document.getElementById("totalLidos");
const totalLendo = document.getElementById("totalLendo");
const totalQueroLer = document.getElementById("totalQueroLer");
const continueGrid = document.getElementById("continueGrid");
const chartBars = document.getElementById("chartBars");
const chartY = document.getElementById("chartY");

function calcularProgresso(livro) {
    if (livro.paginas <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round(
            (livro.paginasLidas / livro.paginas) * 100
        )
    );
}

function atualizarResumo() {
    totalLivros.textContent = livros.length;

    totalLidos.textContent = livros.filter(
        livro => livro.status === "lido"
    ).length;

    totalLendo.textContent = livros.filter(
        livro => livro.status === "lendo"
    ).length;

    totalQueroLer.textContent = livros.filter(
        livro => livro.status === "quero-ler"
    ).length;
}

function renderizarContinueLendo() {
    continueGrid.innerHTML = "";

    const lendo = livros.filter(
        livro => livro.status === "lendo"
    );

    if (lendo.length === 0) {
        continueGrid.innerHTML = `
            <div class="empty-dashboard">
                <p>Você não está lendo nenhum livro no momento.</p>
            </div>
        `;

        return;
    }

    lendo.forEach(livro => {
        const progresso = calcularProgresso(livro);

        const card = document.createElement("article");
        card.classList.add("continue-card");

        card.innerHTML = `
            <a href="pages/livro.html?id=${livro.id}">
                <div class="continue-cover">
                    ${
                        livro.capa
                            ? `
                                <img
                                    src="${livro.capa}"
                                    alt="Capa de ${livro.titulo}"
                                >
                            `
                            : livro.titulo
                    }
                </div>
            </a>

            <div class="continue-info">
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>

                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width: ${progresso}%"
                    ></div>
                </div>

                <span class="progress-text">
                    ${progresso}% concluído
                </span>
            </div>
        `;

        continueGrid.appendChild(card);
    });
}

function gerarDadosMensais() {
    const meses = Array(12).fill(0);

    livros.forEach(livro => {
        if (
            livro.status !== "lido" ||
            !livro.dataConclusao
        ) {
            return;
        }

        const data = new Date(
            `${livro.dataConclusao}T00:00:00`
        );

        if (data.getFullYear() !== 2026) {
            return;
        }

        const mes = data.getMonth();

        meses[mes]++;
    });

    return meses;
}

function renderizarGrafico() {
    const dados = gerarDadosMensais();

    const maiorValor = Math.max(
        ...dados,
        1
    );

    const maximoEixo = Math.max(
        5,
        Math.ceil(maiorValor / 5) * 5
    );

    chartBars.innerHTML = "";
    chartY.innerHTML = "";

    const passos = maximoEixo / 5;

    for (
        let valor = maximoEixo;
        valor >= 0;
        valor -= passos
    ) {
        const eixo = document.createElement("span");

        eixo.textContent = valor;

        chartY.appendChild(eixo);
    }

    dados.forEach(valor => {
        const wrapper =
            document.createElement("div");

        wrapper.classList.add("bar-wrapper");

        const altura =
            valor === 0
                ? 0
                : (valor / maximoEixo) * 100;

        wrapper.innerHTML = `
            <div
                class="chart-bar"
                style="height: ${altura}%"
                title="${valor} livro(s)"
            >
                ${valor > 0 ? valor : ""}
            </div>
        `;

        chartBars.appendChild(wrapper);
    });
}

function atualizarDashboard() {
    livros = carregarLivros();

    atualizarResumo();
    renderizarContinueLendo();
    renderizarGrafico();
}

atualizarDashboard();

const bookModal =
    document.getElementById("bookModal");

const bookForm =
    document.getElementById("bookForm");

const btnAdicionar =
    document.getElementById("btnAdicionar");

const btnAdicionarLivro =
    document.getElementById("btnAdicionarLivro");

const btnFecharModal =
    document.getElementById("btnFecharModal");

const btnCancelar =
    document.getElementById("btnCancelar");

const modalTitle =
    document.getElementById("modalTitle");

const btnSalvarLivro =
    document.getElementById("btnSalvarLivro");

function abrirModal() {
    modalTitle.textContent =
        "Adicionar livro";

    btnSalvarLivro.textContent =
        "Salvar livro";

    bookForm.reset();

    bookModal.classList.add("active");
}

function fecharModal() {
    bookModal.classList.remove("active");

    bookForm.reset();
}

btnAdicionar.addEventListener(
    "click",
    abrirModal
);

btnAdicionarLivro.addEventListener(
    "click",
    abrirModal
);

btnFecharModal.addEventListener(
    "click",
    fecharModal
);

btnCancelar.addEventListener(
    "click",
    fecharModal
);

bookModal.addEventListener(
    "click",
    event => {
        if (event.target === bookModal) {
            fecharModal();
        }
    }
);

bookForm.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const titulo =
            document.getElementById("titulo")
                .value.trim();

        const autor =
            document.getElementById("autor")
                .value.trim();

        const genero =
            document.getElementById("genero")
                .value.trim();

        const paginas =
            Number(
                document.getElementById("paginas")
                    .value
            );

        const status =
            document.getElementById("status")
                .value;

        const nota =
            Number(
                document.getElementById("nota")
                    .value
            );

        const capa =
            document.getElementById("capa")
                .value.trim();

        const descricao =
            document.getElementById("descricao")
                .value.trim();

        const novoLivro = {
            id: Date.now(),
            titulo,
            autor,
            genero,
            paginas,
            paginasLidas:
                status === "lido"
                    ? paginas
                    : 0,
            status,
            nota,
            capa,
            descricao,
            anotacoes: "",
            dataConclusao:
                status === "lido"
                    ? new Date()
                        .toISOString()
                        .split("T")[0]
                    : null
        };

        livros.push(novoLivro);

        salvarLivros(livros);

        atualizarDashboard();

        fecharModal();
    }
);