const livros = carregarLivros();

const totalLidos = document.getElementById("totalLidos");
const paginasLidas = document.getElementById("paginasLidas");
const notaMedia = document.getElementById("notaMedia");
const generosMaisLidos = document.getElementById("generosMaisLidos");
const autoresMaisLidos = document.getElementById("autoresMaisLidos");

function calcularEstatisticas() {
    const livrosConcluidos = livros.filter(
        livro => livro.status === "lido"
    );

    const paginas = livrosConcluidos.reduce(
        (total, livro) => total + Number(livro.paginas || 0),
        0
    );

    const notas = livrosConcluidos.filter(
        livro => Number(livro.nota) > 0
    );

    const media = notas.length > 0
        ? notas.reduce(
            (total, livro) => total + Number(livro.nota),
            0
        ) / notas.length
        : 0;

    totalLidos.textContent = livrosConcluidos.length;
    paginasLidas.textContent = paginas.toLocaleString("pt-BR");
    notaMedia.textContent = media.toFixed(1);

    renderizarGeneros(livrosConcluidos);
    renderizarAutores(livrosConcluidos);
}

function contarValores(lista, propriedade) {
    const contagem = {};

    lista.forEach(livro => {
        const valor = livro[propriedade];

        if (!valor) {
            return;
        }

        contagem[valor] = (contagem[valor] || 0) + 1;
    });

    return Object.entries(contagem)
        .sort((a, b) => b[1] - a[1]);
}

function renderizarGeneros(lista) {
    generosMaisLidos.innerHTML = "";

    const generos = contarValores(lista, "genero");

    if (generos.length === 0) {
        generosMaisLidos.innerHTML = `
            <p class="empty-message">
                Nenhum gênero disponível.
            </p>
        `;

        return;
    }

    const maiorQuantidade = generos[0][1];

    generos.slice(0, 5).forEach(([genero, quantidade]) => {
        const porcentagem = Math.round(
            (quantidade / lista.length) * 100
        );

        const item = document.createElement("div");
        item.classList.add("stat-list-item");

        item.innerHTML = `
            <div class="stat-list-header">
                <span>${genero}</span>
                <strong>${porcentagem}%</strong>
            </div>

            <div class="stat-bar">
                <div
                    class="stat-bar-fill"
                    style="width: ${(quantidade / maiorQuantidade) * 100}%"
                ></div>
            </div>
        `;

        generosMaisLidos.appendChild(item);
    });
}

function renderizarAutores(lista) {
    autoresMaisLidos.innerHTML = "";

    const autores = contarValores(lista, "autor");

    if (autores.length === 0) {
        autoresMaisLidos.innerHTML = `
            <p class="empty-message">
                Nenhum autor disponível.
            </p>
        `;

        return;
    }

    const maiorQuantidade = autores[0][1];

    autores.slice(0, 5).forEach(([autor, quantidade]) => {
        const item = document.createElement("div");
        item.classList.add("stat-list-item");

        item.innerHTML = `
            <div class="stat-list-header">
                <span>${autor}</span>
                <strong>${quantidade}</strong>
            </div>

            <div class="stat-bar">
                <div
                    class="stat-bar-fill"
                    style="width: ${(quantidade / maiorQuantidade) * 100}%"
                ></div>
            </div>
        `;

        autoresMaisLidos.appendChild(item);
    });
}

calcularEstatisticas();