let livros = carregarLivros();

const yearFilter = document.getElementById("yearFilter");
const totalLidos = document.getElementById("totalLidos");
const paginasLidas = document.getElementById("paginasLidas");
const notaMedia = document.getElementById("notaMedia");
const generosMaisLidos = document.getElementById("generosMaisLidos");
const autoresMaisLidos = document.getElementById("autoresMaisLidos");
const chartBars = document.getElementById("chartBars");
const chartY = document.getElementById("chartY");

function obterAnoLivro(livro) {
    if (!livro.dataConclusao) {
        return null;
    }

    const data = new Date(
        `${livro.dataConclusao}T00:00:00`
    );

    if (Number.isNaN(data.getTime())) {
        return null;
    }

    return data.getFullYear();
}

function obterMesLivro(livro) {
    if (!livro.dataConclusao) {
        return null;
    }

    const data = new Date(
        `${livro.dataConclusao}T00:00:00`
    );

    if (Number.isNaN(data.getTime())) {
        return null;
    }

    return data.getMonth();
}

function obterLivrosDoAno() {
    const ano = Number(yearFilter.value);

    return livros.filter(livro => {
        return (
            livro.status === "lido" &&
            obterAnoLivro(livro) === ano
        );
    });
}

function atualizarResumo() {
    const livrosDoAno = obterLivrosDoAno();

    totalLidos.textContent =
        livrosDoAno.length;

    const paginas = livrosDoAno.reduce(
        (total, livro) => {
            return total + Number(
                livro.paginasLidas || 0
            );
        },
        0
    );

    paginasLidas.textContent = paginas;

    const livrosComNota =
        livrosDoAno.filter(
            livro => Number(livro.nota) > 0
        );

    if (livrosComNota.length === 0) {
        notaMedia.textContent = "0";
        return;
    }

    const somaNotas =
        livrosComNota.reduce(
            (total, livro) => {
                return total + Number(livro.nota);
            },
            0
        );

    const media =
        somaNotas / livrosComNota.length;

    notaMedia.textContent =
        media.toFixed(1);
}

function gerarDadosMensais() {
    const dados = Array(12).fill(0);
    const livrosDoAno = obterLivrosDoAno();

    livrosDoAno.forEach(livro => {
        const mes = obterMesLivro(livro);

        if (mes !== null) {
            dados[mes]++;
        }
    });

    return dados;
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
        const eixo =
            document.createElement("span");

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

function contarPorCampo(lista, campo) {
    const contagem = {};

    lista.forEach(livro => {
        const valor = livro[campo];

        if (!valor) {
            return;
        }

        contagem[valor] =
            (contagem[valor] || 0) + 1;
    });

    return Object.entries(contagem)
        .sort((a, b) => b[1] - a[1]);
}

function renderizarLista(elemento, dados) {
    elemento.innerHTML = "";

    if (dados.length === 0) {
        elemento.innerHTML = `
            <p class="empty-message">
                Nenhum dado disponível.
            </p>
        `;

        return;
    }

    const maiorQuantidade =
        dados[0][1];

    dados.forEach(
        ([nome, quantidade]) => {
            const percentual =
                (quantidade / maiorQuantidade) * 100;

            const item =
                document.createElement("div");

            item.classList.add(
                "stat-list-item"
            );

            item.innerHTML = `
                <div class="stat-list-header">
                    <span>${nome}</span>
                    <strong>${quantidade}</strong>
                </div>

                <div class="stat-bar">
                    <div
                        class="stat-bar-fill"
                        style="width: ${percentual}%"
                    ></div>
                </div>
            `;

            elemento.appendChild(item);
        }
    );
}

function atualizarGeneros() {
    const livrosDoAno =
        obterLivrosDoAno();

    const generos =
        contarPorCampo(
            livrosDoAno,
            "genero"
        );

    renderizarLista(
        generosMaisLidos,
        generos
    );
}

function atualizarAutores() {
    const livrosDoAno =
        obterLivrosDoAno();

    const autores =
        contarPorCampo(
            livrosDoAno,
            "autor"
        );

    renderizarLista(
        autoresMaisLidos,
        autores
    );
}

function atualizarEstatisticas() {
    livros = carregarLivros();

    atualizarResumo();
    renderizarGrafico();
    atualizarGeneros();
    atualizarAutores();
}

function preencherAnos() {
    const anos = new Set();

    livros.forEach(livro => {
        const ano = obterAnoLivro(livro);

        if (ano) {
            anos.add(ano);
        }
    });

    anos.add(
        new Date().getFullYear()
    );

    const anosOrdenados =
        [...anos].sort(
            (a, b) => b - a
        );

    yearFilter.innerHTML = "";

    anosOrdenados.forEach(ano => {
        const option =
            document.createElement("option");

        option.value = ano;
        option.textContent = ano;

        yearFilter.appendChild(option);
    });

    yearFilter.value =
        new Date().getFullYear();
}

const bookModal =
    document.getElementById("bookModal");

const bookForm =
    document.getElementById("bookForm");

const btnAdicionar =
    document.getElementById("btnAdicionar");

const btnFecharModal =
    document.getElementById("btnFecharModal");

const btnCancelar =
    document.getElementById("btnCancelar");

const btnSalvarLivro =
    document.getElementById("btnSalvarLivro");

function abrirModal() {
    bookForm.reset();

    btnSalvarLivro.textContent =
        "Salvar livro";

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

        fecharModal();

        atualizarEstatisticas();
    }
);

yearFilter.addEventListener(
    "change",
    atualizarEstatisticas
);

preencherAnos();
atualizarEstatisticas();