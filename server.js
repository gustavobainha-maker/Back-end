import Fastify from 'fastify'
import { Pool } from 'pg'
import cors from '@fastify/cors'

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "todo_list"
})

const servidor = Fastify()

servidor.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE']
})

servidor.get('/', async () => {
    return { mensagem: "API To-Do List funcionando!" }
})

servidor.get('/usuarios', async () => {
    const resultado = await sql.query('select * from usuarios')
    return resultado.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const email = request.body.email
    const senha = request.body.senha

    if (!email || !senha) {
        return reply.status(400).send({
            error: "email e senha são obrigatórios!"
        })
    }

    const resultado = await sql.query(
        'INSERT INTO usuarios (email, senha) VALUES ($1, $2)',
        [email, senha]
    )

    reply.status(201).send({
        mensagem: "Deu certo!"
    })
})

servidor.post('/login', async (request, reply) => {
    const email = request.body.email
    const senha = request.body.senha

    const resultado = await sql.query(
        'select * from usuarios where email = $1 AND senha = $2',
        [email, senha]
    )

    if (resultado.rows.length === 0) {
        return reply.status(401).send({
            error: "email ou senha inválidos!"
        })
    }

    reply.status(200).send({
        mensagem: "login realizado com sucesso!",
        ok: true
    })
})

servidor.post('/tarefas', async (request, reply) => {
    const titulo = request.body.titulo
    const descricao = request.body.descricao
    const usuario_id = request.body.usuario_id

    if (!titulo || !usuario_id) {
        return reply.status(400).send({
            error: "titulo e usuario_id são obrigatórios!"
        })
    }

    const usuario = await sql.query(
        'select * from usuarios where id = $1',
        [usuario_id]
    )

    if (usuario.rows.length === 0) {
        return reply.status(400).send({
            error: "Usuário não existe!"
        })
    }

    const resultado = await sql.query(
        'INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ($1, $2, $3)',
        [titulo, descricao, usuario_id]
    )

    reply.status(201).send({
        mensagem: "Tarefa criada!"
    })
})

servidor.get('/tarefas', async (request) => {
    const usuario_id = request.query.usuario_id

    const resultado = await sql.query(
        'select * from tarefas where usuario_id = $1',
        [usuario_id]
    )

    return resultado.rows
})

servidor.get('/tarefas/:id', async (request, reply) => {
    const id = request.params.id

    const resultado = await sql.query(
        'select * from tarefas where id = $1',
        [id]
    )

    if (resultado.rows.length === 0) {
        return reply.status(404).send({
            error: "Tarefa não encontrada"
        })
    }

    reply.send(resultado.rows[0])
})

servidor.put('/tarefas/:id', async (request, reply) => {
    const body = request.body
    const id = request.params.id

    if (!body || !body.titulo || !body.descricao) {
        return reply.status(400).send({
            error: "titulo e descricao são obrigatórios!"
        })
    }

    const resultado = await sql.query(
        'UPDATE tarefas SET titulo = $1, descricao = $2, concluida = $3 WHERE id = $4',
        [body.titulo, body.descricao, body.concluida, id]
    )

    reply.send({
        mensagem: "Tarefa alterada!"
    })
})

servidor.delete('/tarefas/:id', async (request, reply) => {
    const id = request.params.id

    const resultado = await sql.query(
        'DELETE FROM tarefas WHERE id = $1',
        [id]
    )

    reply.status(204).send()
})

servidor.listen({
    port: 3000
})