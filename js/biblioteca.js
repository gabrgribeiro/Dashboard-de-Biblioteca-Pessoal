const bookGrid = document.getElementById("bookGrid");
const searchBook = document.getElementById("searchBook");
const statusFilter = document.getElementById("statusFilter");
const sortBooks = document.getElementById("sortBooks");

function calcularProgresso(livro) {
    if (livro.paginas <= 0) {
        return 0;
    }

    return Math.round(
        (livro.paginasLidas / livro.paginas) * 100
    );
}

function formatarStatus(status) {
    const statusMap = {
        "quero-ler": "Quero ler",
        "lendo": "Lendo",
        "lido": "Lido",
        "abandonado": "Abandonado"
    };

    return statusMap[status] || status;
}

function renderizarLivros(lista) {
    bookGrid.innerHTML = "";

    if (lista.length === 0) {
        bookGrid.innerHTML = `
            <p class="empty-message">
                Nenhum livro encontrado.
            </p>
        `;

        return;
    }

    lista.forEach(livro => {
        const progresso = calcularProgresso(livro);

        const card = document.createElement("article");
        card.classList.add("library-card");

        card.innerHTML = `
            <a href="livro.html?id=${livro.id}">
                <div class="book-cover placeholder-cover">
                    ${livro.titulo}
                </div>
            </a>

            <h3>${livro.titulo}</h3>
            <p>${livro.autor}</p>

            <strong>
                ${livro.nota > 0 ? `★ ${livro.nota}` : "Sem nota"}
            </strong>

            <span class="status ${livro.status}">
                ${formatarStatus(livro.status)}
                ${livro.status === "lendo" ? ` — ${progresso}%` : ""}
            </span>
        `;

        bookGrid.appendChild(card);
    });
}

function filtrarLivros() {
    const pesquisa = searchBook.value
        .toLowerCase()
        .trim();

    const status = statusFilter.value;
    const ordenacao = sortBooks.value;

    let resultado = livros.filter(livro => {
        const correspondePesquisa =
            livro.titulo
                .toLowerCase()
                .includes(pesquisa) ||
            livro.autor
                .toLowerCase()
                .includes(pesquisa);

        const correspondeStatus =
            status === "todos" ||
            livro.status === status;

        return correspondePesquisa && correspondeStatus;
    });

    resultado.sort((a, b) => {
        switch (ordenacao) {
            case "titulo":
                return a.titulo.localeCompare(b.titulo);

            case "autor":
                return a.autor.localeCompare(b.autor);

            case "nota":
                return b.nota - a.nota;

            case "progresso":
                return calcularProgresso(b) - calcularProgresso(a);

            default:
                return 0;
        }
    });

    renderizarLivros(resultado);
}

searchBook.addEventListener("input", filtrarLivros);
statusFilter.addEventListener("change", filtrarLivros);
sortBooks.addEventListener("change", filtrarLivros);

renderizarLivros(livros);