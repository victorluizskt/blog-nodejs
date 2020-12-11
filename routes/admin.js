const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');

// Rota principal para o painel administrativo
    router.get('/', (req, res) => {
        res.render('admin/index')
    });

// Rota para os posts
    router.get('/posts', (req, res) => {
        res.send('Página de posts.');
    });

// Rota de categorias
    router.get('/categorias', (req, res) => {
        res.render('admin/categorias');
    });

// Rota para o formulário
    router.get('/categorias/add', (req, res) => {
        res.render('admin/addcategorias');
    });

// Rota responsável por cadastrar o formulário dentro do mongo
    router.post('/categorias/nova', (req, res) => {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            console.log('Categoria salva com sucesso');
        }).catch((err) => {
            console.log('Erro ao salvar categoria.');
        });
    });

module.exports = router;