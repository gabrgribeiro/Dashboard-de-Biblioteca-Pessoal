const livrosIniciais = [
    {
        id: 1,
        titulo: "O Hobbit",
        autor: "J. R. R. Tolkien",
        genero: "Fantasia",
        paginas: 310,
        paginasLidas: 310,
        status: "lido",
        nota: 9,
        capa: "",
        descricao: "Bilbo Bolseiro embarca em uma aventura inesperada ao lado de Gandalf e dos anões.",
        anotacoes: ""
    },
    {
        id: 2,
        titulo: "Duna",
        autor: "Frank Herbert",
        genero: "Ficção científica",
        paginas: 680,
        paginasLidas: 421,
        status: "lendo",
        nota: 8.5,
        capa: "",
        descricao: "Paul Atreides precisa enfrentar uma série de acontecimentos que mudarão o destino de Arrakis.",
        anotacoes: ""
    },
    {
        id: 3,
        titulo: "1984",
        autor: "George Orwell",
        genero: "Ficção",
        paginas: 328,
        paginasLidas: 328,
        status: "lido",
        nota: 9.5,
        capa: "",
        descricao: "Uma sociedade controlada por um governo totalitário onde a vigilância é constante.",
        anotacoes: ""
    },
    {
        id: 4,
        titulo: "It: A Coisa",
        autor: "Stephen King",
        genero: "Terror",
        paginas: 1104,
        paginasLidas: 0,
        status: "quero-ler",
        nota: 0,
        capa: "",
        descricao: "Um grupo de crianças enfrenta uma entidade sobrenatural que assombra a cidade de Derry.",
        anotacoes: ""
    }
];

function carregarLivros() {
    const livrosSalvos = localStorage.getItem("livros");

    if (livrosSalvos) {
        return JSON.parse(livrosSalvos);
    }

    localStorage.setItem(
        "livros",
        JSON.stringify(livrosIniciais)
    );

    return livrosIniciais;
}

function salvarLivros(livros) {
    localStorage.setItem(
        "livros",
        JSON.stringify(livros)
    );
}