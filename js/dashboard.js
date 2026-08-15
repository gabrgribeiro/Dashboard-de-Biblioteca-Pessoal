const livros = carregarLivros();

const totalLivros = document.getElementById("totalLivros");
const totalLidos = document.getElementById("totalLidos");
const totalLendo = document.getElementById("totalLendo");
const continueReading = document.getElementById("continueReading");

function calcularProgresso(livro) {
    if (!livro.paginas || livro.paginas <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round((livro.paginasLidas / livro.paginas) * 100)
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
}

function renderizarContinueLendo() {
    const livrosLendo = livros
        .filter(livro => livro.status === "lendo")
        .sort((a, b) => calcularProgresso(a) - calcularProgresso(b))
        .slice(0, 4);

    continueReading.innerHTML = "";

    if (livrosLendo.length === 0) {
        continueReading.innerHTML = `
            <p class="empty-message">
                Você não está lendo nenhum livro no momento.
            </p>
        `;

        return;
    }

    livrosLendo.forEach(livro => {
        const progresso = calcularProgresso(livro);

        const card = document.createElement("article");
        card.classList.add("reading-card");

        const capa = livro.capa
            ? `<img src="${livro.capa}" alt="Capa de ${livro.titulo}">`
            : `<span>${livro.titulo}</span>`;

        card.innerHTML = `
            <a href="pages/livro.html?id=${livro.id}">
                <div class="book-cover">
                    ${capa}
                </div>
            </a>

            <div class="reading-card-content">
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: ${progresso}%"
                    ></div>
                </div>

                <div class="progress-info">
                    <span>Progresso</span>
                    <span>${progresso}%</span>
                </div>
            </div>
        `;

        continueReading.appendChild(card);
    });
}

atualizarResumo();
renderizarContinueLendo();