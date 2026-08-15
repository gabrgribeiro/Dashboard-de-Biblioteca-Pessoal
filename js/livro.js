const params = new URLSearchParams(window.location.search);
const livroId = Number(params.get("id"));

const livro = carregarLivros().find(
    livro => livro.id === livroId
);

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookGenre = document.getElementById("bookGenre");
const bookPages = document.getElementById("bookPages");
const bookRating = document.getElementById("bookRating");
const bookStatus = document.getElementById("bookStatus");
const bookDescription = document.getElementById("bookDescription");
const bookCover = document.getElementById("bookCover");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const pagesProgress = document.getElementById("pagesProgress");
const bookNotes = document.getElementById("bookNotes");

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

function carregarLivro() {
    if (!livro) {
        bookTitle.textContent = "Livro não encontrado";
        return;
    }

    const progresso = calcularProgresso(livro);

    bookTitle.textContent = livro.titulo;
    bookAuthor.textContent = livro.autor;
    bookGenre.textContent = livro.genero;
    bookPages.textContent = `${livro.paginas} páginas`;

    bookRating.textContent =
        livro.nota > 0
            ? `★ ${livro.nota} / 10`
            : "Sem nota";

    bookStatus.textContent = formatarStatus(livro.status);

    bookDescription.textContent =
        livro.descricao || "Nenhuma descrição adicionada.";

    bookNotes.value = livro.anotacoes || "";

    progressText.textContent = `${progresso}%`;
    progressFill.style.width = `${progresso}%`;

    pagesProgress.textContent =
        `${livro.paginasLidas} / ${livro.paginas} páginas`;

    if (livro.capa) {
        bookCover.innerHTML = `
            <img src="${livro.capa}" alt="Capa de ${livro.titulo}">
        `;
    } else {
        bookCover.textContent = livro.titulo;
    }
}

document.getElementById("btnExcluir").addEventListener("click", () => {
    if (!livro) {
        return;
    }

    const confirmar = confirm(
        `Deseja realmente excluir "${livro.titulo}"?`
    );

    if (!confirmar) {
        return;
    }

    const livros = carregarLivros();

    const novosLivros = livros.filter(
        item => item.id !== livro.id
    );

    salvarLivros(novosLivros);

    window.location.href = "biblioteca.html";
});

document.getElementById("btnSalvarAnotacoes").addEventListener("click", () => {
    if (!livro) {
        return;
    }

    const livros = carregarLivros();

    const livroAtualizado = livros.find(
        item => item.id === livro.id
    );

    if (!livroAtualizado) {
        return;
    }

    livroAtualizado.anotacoes = bookNotes.value.trim();

    salvarLivros(livros);

    alert("Anotações salvas.");
});

carregarLivro();