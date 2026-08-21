CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);