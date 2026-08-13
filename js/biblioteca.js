let livros = carregarLivros();

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

const bookModal = document.getElementById("bookModal");
const bookForm = document.getElementById("bookForm");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnAdicionarLivro = document.getElementById("btnAdicionarLivro");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");

function abrirModal() {
    bookModal.classList.add("active");
}

function fecharModal() {
    bookModal.classList.remove("active");
    bookForm.reset();
}

btnAdicionar.addEventListener("click", abrirModal);
btnAdicionarLivro.addEventListener("click", abrirModal);
btnFecharModal.addEventListener("click", fecharModal);
btnCancelar.addEventListener("click", fecharModal);

bookModal.addEventListener("click", event => {
    if (event.target === bookModal) {
        fecharModal();
    }
});

bookForm.addEventListener("submit", event => {
    event.preventDefault();

    const novoLivro = {
        id: Date.now(),
        titulo: document.getElementById("titulo").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        paginas: Number(document.getElementById("paginas").value),
        paginasLidas: 0,
        status: document.getElementById("status").value,
        nota: Number(document.getElementById("nota").value),
        capa: document.getElementById("capa").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        anotacoes: ""
    };

    livros.push(novoLivro);

    salvarLivros(livros);

    renderizarLivros(livros);

    fecharModal();
}); 