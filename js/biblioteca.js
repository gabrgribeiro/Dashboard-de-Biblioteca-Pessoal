let livros = carregarLivros();

const bookGrid = document.getElementById("bookGrid");
const searchBook = document.getElementById("searchBook");
const statusFilter = document.getElementById("statusFilter");
const sortBooks = document.getElementById("sortBooks");

function calcularProgresso(livro) {
    if (livro.paginas <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round((livro.paginasLidas / livro.paginas) * 100)
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
    if (!bookGrid) {
        return;
    }

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
                ${
                    livro.capa
                        ? `
                            <div class="book-cover">
                                <img src="${livro.capa}" alt="Capa de ${livro.titulo}">
                            </div>
                        `
                        : `
                            <div class="book-cover placeholder-cover">
                                ${livro.titulo}
                            </div>
                        `
                }
            </a>

            <h3>${livro.titulo}</h3>
            <p>${livro.autor}</p>

            <strong>
                ${livro.nota > 0 ? `★ ${livro.nota}` : "Sem nota"}
            </strong>

            <span class="status ${livro.status}">
                ${formatarStatus(livro.status)}
                ${
                    livro.status === "lendo"
                        ? ` — ${progresso}%`
                        : ""
                }
            </span>
        `;

        bookGrid.appendChild(card);
    });
}

function filtrarLivros() {
    if (!searchBook || !statusFilter || !sortBooks) {
        return;
    }

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

if (searchBook) {
    searchBook.addEventListener(
        "input",
        filtrarLivros
    );
}

if (statusFilter) {
    statusFilter.addEventListener(
        "change",
        filtrarLivros
    );
}

if (sortBooks) {
    sortBooks.addEventListener(
        "change",
        filtrarLivros
    );
}

renderizarLivros(livros);

const bookModal = document.getElementById("bookModal");
const bookForm = document.getElementById("bookForm");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnAdicionarLivro = document.getElementById("btnAdicionarLivro");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const modalTitle = document.getElementById("modalTitle");
const btnSalvarLivro = document.getElementById("btnSalvarLivro");

let livroEditandoId = null;

function abrirModal() {
    if (!bookModal || !bookForm) {
        return;
    }

    livroEditandoId = null;

    modalTitle.textContent = "Adicionar livro";
    btnSalvarLivro.textContent = "Salvar livro";

    bookForm.reset();

    bookModal.classList.add("active");
}

function fecharModal() {
    if (!bookModal || !bookForm) {
        return;
    }

    bookModal.classList.remove("active");
    bookForm.reset();
    livroEditandoId = null;
}

function editarLivro(id) {
    const livro = livros.find(
        livro => livro.id === id
    );

    if (!livro) {
        return;
    }

    livroEditandoId = id;

    modalTitle.textContent = "Editar livro";
    btnSalvarLivro.textContent = "Salvar alterações";

    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("genero").value = livro.genero;
    document.getElementById("paginas").value = livro.paginas;
    document.getElementById("status").value = livro.status;
    document.getElementById("nota").value = livro.nota;
    document.getElementById("capa").value = livro.capa || "";
    document.getElementById("descricao").value = livro.descricao || "";

    bookModal.classList.add("active");
}

if (btnAdicionar) {
    btnAdicionar.addEventListener(
        "click",
        abrirModal
    );
}

if (btnAdicionarLivro) {
    btnAdicionarLivro.addEventListener(
        "click",
        abrirModal
    );
}

if (btnFecharModal) {
    btnFecharModal.addEventListener(
        "click",
        fecharModal
    );
}

if (btnCancelar) {
    btnCancelar.addEventListener(
        "click",
        fecharModal
    );
}

if (bookModal) {
    bookModal.addEventListener(
        "click",
        event => {
            if (event.target === bookModal) {
                fecharModal();
            }
        }
    );
}

if (bookForm) {
    bookForm.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            const titulo = document
                .getElementById("titulo")
                .value
                .trim();

            const autor = document
                .getElementById("autor")
                .value
                .trim();

            const genero = document
                .getElementById("genero")
                .value
                .trim();

            const paginas = Number(
                document.getElementById("paginas").value
            );

            const status = document
                .getElementById("status")
                .value;

            const nota = Number(
                document.getElementById("nota").value
            );

            const capa = document
                .getElementById("capa")
                .value
                .trim();

            const descricao = document
                .getElementById("descricao")
                .value
                .trim();

            if (livroEditandoId === null) {
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
            } else {
                const livro = livros.find(
                    livro => livro.id === livroEditandoId
                );

                if (!livro) {
                    return;
                }

                const statusAnterior = livro.status;

                livro.titulo = titulo;
                livro.autor = autor;
                livro.genero = genero;
                livro.paginas = paginas;
                livro.status = status;
                livro.nota = nota;
                livro.capa = capa;
                livro.descricao = descricao;

                if (status === "lido") {
                    livro.paginasLidas = paginas;

                    if (
                        statusAnterior !== "lido" ||
                        !livro.dataConclusao
                    ) {
                        livro.dataConclusao =
                            new Date()
                                .toISOString()
                                .split("T")[0];
                    }
                } else {
                    livro.dataConclusao = null;

                    if (
                        status === "quero-ler"
                    ) {
                        livro.paginasLidas = 0;
                    }
                }
            }

            salvarLivros(livros);

            renderizarLivros(livros);

            fecharModal();
        }
    );
}

const params = new URLSearchParams(
    window.location.search
);

if (params.get("adicionar") === "true") {
    abrirModal();
}