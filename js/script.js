let livros = carregarLivros();

const totalLivros = document.getElementById("totalLivros");
const livrosLidos = document.getElementById("livrosLidos");
const livrosLendo = document.getElementById("livrosLendo");
const continueReading = document.getElementById("continueReading");

function calcularProgresso(livro) {
    if (livro.paginas <= 0) {
        return 0;
    }

    return Math.round(
        (livro.paginasLidas / livro.paginas) * 100
    );
}

function atualizarDashboard() {
    const total = livros.length;

    const lidos = livros.filter(
        livro => livro.status === "lido"
    ).length;

    const lendo = livros.filter(
        livro => livro.status === "lendo"
    ).length;

    totalLivros.textContent = total;
    livrosLidos.textContent = lidos;
    livrosLendo.textContent = lendo;
}

function renderizarContinuarLendo() {
    const livrosLendo = livros.filter(
        livro => livro.status === "lendo"
    );

    continueReading.innerHTML = "";

    if (livrosLendo.length === 0) {
        continueReading.innerHTML = `
            <p>Nenhum livro sendo lido no momento.</p>
        `;

        return;
    }

    livrosLendo.forEach(livro => {
        const progresso = calcularProgresso(livro);

        const card = document.createElement("article");
        card.classList.add("book-card");

        card.innerHTML = `
            <a href="pages/livro.html?id=${livro.id}">
                <div class="book-cover placeholder-cover">
                    ${livro.titulo}
                </div>
            </a>

            <h3>${livro.titulo}</h3>

            <div class="progress">
                <div
                    class="progress-bar"
                    style="width: ${progresso}%;">
                </div>
            </div>

            <span>${progresso}%</span>
        `;

        continueReading.appendChild(card);
    });
}

atualizarDashboard();
renderizarContinuarLendo();

const btnAdicionar = document.getElementById("btnAdicionar");

if (btnAdicionar) {
    btnAdicionar.addEventListener("click", () => {
        alert("Modal de adicionar livro será implementado.");
    });
}