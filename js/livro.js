let livros = carregarLivros();

const bookDetails = document.getElementById("bookDetails");

const params = new URLSearchParams(
    window.location.search
);

const id = Number(params.get("id"));

const livro = livros.find(
    livro => livro.id === id
);

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

function renderizarLivro(livro) {
    const progresso = calcularProgresso(livro);

    bookDetails.innerHTML = `
        <a class="back-link" href="biblioteca.html">
            ← Voltar para biblioteca
        </a>

        <div class="book-main">
            <div class="book-cover large placeholder-cover">
                ${livro.titulo}
            </div>

            <div class="book-info">
                <h2>${livro.titulo}</h2>

                <h3>${livro.autor}</h3>

                <p>
                    ${livro.genero} · ${livro.paginas} páginas
                </p>

                <div class="rating">
                    ${livro.nota > 0
                        ? `★ ${livro.nota} / 10`
                        : "Sem nota"}
                </div>

                <p>
                    <strong>Status:</strong>
                    ${formatarStatus(livro.status)}
                </p>

                <div class="progress-info">
                    <span>Progresso</span>

                    <strong>
                        ${livro.paginasLidas} / ${livro.paginas} páginas
                        — ${progresso}%
                    </strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width: ${progresso}%;">
                    </div>
                </div>

                <button
                    class="primary-button"
                    type="button"
                    id="btnProgresso">
                    Atualizar progresso
                </button>
            </div>
        </div>

        <div class="description">
            <h2>Descrição</h2>
            <p>${livro.descricao}</p>
        </div>

        <div class="notes">
            <h2>Anotações</h2>

            <textarea
                id="anotacoes"
                placeholder="Escreva suas anotações sobre o livro...">${livro.anotacoes}</textarea>
        </div>

        <div class="book-actions">
            <button
                class="secondary-button"
                id="btnEditar"
                type="button">
                Editar
            </button>

            <button
                class="danger-button"
                id="btnExcluir"
                type="button">
                Excluir
            </button>
        </div>
    `;
}

if (!livro) {
    bookDetails.innerHTML = `
        <h2>Livro não encontrado</h2>
        <a href="biblioteca.html">
            Voltar para biblioteca
        </a>
    `;
} else {
    renderizarLivro(livro);
}