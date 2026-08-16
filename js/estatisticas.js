let livros = carregarLivros();

const totalLidos = document.getElementById("totalLidos");
const paginasLidas = document.getElementById("paginasLidas");
const notaMedia = document.getElementById("notaMedia");
const generosMaisLidos = document.getElementById("generosMaisLidos");
const autoresMaisLidos = document.getElementById("autoresMaisLidos");
const yearFilter = document.getElementById("yearFilter");
const chartBars = document.getElementById("chartBars");
const maxChartValue = document.getElementById("maxChartValue");

function obterLivrosConcluidos(ano) {
    return livros.filter(livro => {
        if (livro.status !== "lido") {
            return false;
        }

        if (!livro.dataConclusao) {
            return false;
        }

        const data = new Date(livro.dataConclusao);

        return data.getFullYear() === Number(ano);
    });
}

function calcularEstatisticas(ano) {
    const livrosLidos = obterLivrosConcluidos(ano);

    const total = livrosLidos.length;

    const paginas = livrosLidos.reduce(
        (total, livro) => total + Number(livro.paginas || 0),
        0
    );

    const livrosComNota = livrosLidos.filter(
        livro => Number(livro.nota) > 0
    );

    const media = livrosComNota.length > 0
        ? livrosComNota.reduce(
            (total, livro) => total + Number(livro.nota),
            0
        ) / livrosComNota.length
        : 0;

    totalLidos.textContent = total;
    paginasLidas.textContent = paginas.toLocaleString("pt-BR");
    notaMedia.textContent = media.toFixed(1);
}

function obterLivrosPorMes(ano) {
    const livrosPorMes = Array(12).fill(0);

    const livrosLidos = obterLivrosConcluidos(ano);

    livrosLidos.forEach(livro => {
        const data = new Date(livro.dataConclusao);
        const mes = data.getMonth();

        livrosPorMes[mes]++;
    });

    return livrosPorMes;
}

function renderizarGrafico(ano) {
    const livrosPorMes = obterLivrosPorMes(ano);

    chartBars.innerHTML = "";

    const maiorValor = Math.max(...livrosPorMes, 1);

    maxChartValue.textContent = maiorValor;

    livrosPorMes.forEach(valor => {
        const barWrapper = document.createElement("div");
        barWrapper.classList.add("bar-wrapper");

        const bar = document.createElement("div");
        bar.classList.add("chart-bar");

        const altura = valor === 0
            ? 0
            : (valor / maiorValor) * 100;

        bar.style.height = `${altura}%`;

        if (valor > 0) {
            bar.textContent = valor;
        }

        barWrapper.appendChild(bar);
        chartBars.appendChild(barWrapper);
    });
}

function obterRanking(lista, propriedade) {
    const ranking = {};

    lista.forEach(livro => {
        const valor = livro[propriedade];

        if (!valor) {
            return;
        }

        ranking[valor] = (ranking[valor] || 0) + 1;
    });

    return Object.entries(ranking)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
}

function renderizarGeneros(ano) {
    const livrosLidos = obterLivrosConcluidos(ano);
    const ranking = obterRanking(livrosLidos, "genero");

    generosMaisLidos.innerHTML = "";

    if (ranking.length === 0) {
        generosMaisLidos.innerHTML = "<p>Nenhum dado disponível.</p>";
        return;
    }

    ranking.forEach(([genero, quantidade]) => {
        const item = document.createElement("div");
        item.classList.add("ranking-item");

        item.innerHTML = `
            <div>
                <span>${genero}</span>
                <strong>${quantidade}</strong>
            </div>

            <div class="ranking-bar">
                <span style="width: ${(quantidade / ranking[0][1]) * 100}%"></span>
            </div>
        `;

        generosMaisLidos.appendChild(item);
    });
}

function renderizarAutores(ano) {
    const livrosLidos = obterLivrosConcluidos(ano);
    const ranking = obterRanking(livrosLidos, "autor");

    autoresMaisLidos.innerHTML = "";

    if (ranking.length === 0) {
        autoresMaisLidos.innerHTML = "<p>Nenhum dado disponível.</p>";
        return;
    }

    ranking.forEach(([autor, quantidade]) => {
        const item = document.createElement("div");
        item.classList.add("ranking-item");

        item.innerHTML = `
            <div>
                <span>${autor}</span>
                <strong>${quantidade}</strong>
            </div>

            <div class="ranking-bar">
                <span style="width: ${(quantidade / ranking[0][1]) * 100}%"></span>
            </div>
        `;

        autoresMaisLidos.appendChild(item);
    });
}

function atualizarEstatisticas() {
    const ano = yearFilter.value;

    livros = carregarLivros();

    calcularEstatisticas(ano);
    renderizarGrafico(ano);
    renderizarGeneros(ano);
    renderizarAutores(ano);
}

yearFilter.addEventListener(
    "change",
    atualizarEstatisticas
);

atualizarEstatisticas();