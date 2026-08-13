const totalLidos = document.getElementById("totalLidos");
const paginasLidas = document.getElementById("paginasLidas");
const notaMedia = document.getElementById("notaMedia");

const generosMaisLidos =
    document.getElementById("generosMaisLidos");

const autoresMaisLidos =
    document.getElementById("autoresMaisLidos");

function calcularEstatisticas() {
    const livrosConcluidos = livros.filter(
        livro => livro.status === "lido"
    );

    const totalPaginas = livrosConcluidos.reduce(
        (total, livro) => total + livro.paginasLidas,
        0
    );

    const livrosComNota = livrosConcluidos.filter(
        livro => livro.nota > 0
    );

    const somaNotas = livrosComNota.reduce(
        (total, livro) => total + livro.nota,
        0
    );

    const media =
        livrosComNota.length > 0
            ? somaNotas / livrosComNota.length
            : 0;

    totalLidos.textContent =
        livrosConcluidos.length;

    paginasLidas.textContent =
        totalPaginas.toLocaleString("pt-BR");

    notaMedia.textContent =
        media.toFixed(1);
}

function calcularGeneros() {
    const generos = {};

    livros
        .filter(livro => livro.status === "lido")
        .forEach(livro => {
            if (!generos[livro.genero]) {
                generos[livro.genero] = 0;
            }

            generos[livro.genero]++;
        });

    generosMaisLidos.innerHTML = "";

    Object.entries(generos)
        .sort((a, b) => b[1] - a[1])
        .forEach(([genero, quantidade]) => {
            const elemento = document.createElement("p");

            elemento.innerHTML = `
                <span>${genero}</span>
                <strong>${quantidade}</strong>
            `;

            generosMaisLidos.appendChild(elemento);
        });
}

function calcularAutores() {
    const autores = {};

    livros
        .filter(livro => livro.status === "lido")
        .forEach(livro => {
            if (!autores[livro.autor]) {
                autores[livro.autor] = 0;
            }

            autores[livro.autor]++;
        });

    autoresMaisLidos.innerHTML = "";

    Object.entries(autores)
        .sort((a, b) => b[1] - a[1])
        .forEach(([autor, quantidade]) => {
            const elemento = document.createElement("p");

            elemento.innerHTML = `
                <span>${autor}</span>
                <strong>${quantidade}</strong>
            `;

            autoresMaisLidos.appendChild(elemento);
        });
}

calcularEstatisticas();
calcularGeneros();
calcularAutores();