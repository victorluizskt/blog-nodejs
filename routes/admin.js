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
        var erros = [];

        if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
            erros.push({texto: 'Nome inválido.'});
        };

        if(!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null){
            erros.push({texto: 'Slug inválido.'})
        };

        if(req.body.nome.length < 2){
            erros.push({texto: 'Nome da categoria é muito pequeno.'})
        };

        if(erros.length > 0){ 
            res.render('admin/addcategorias', {
                erros: erros
            });
        } else {
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            };
            new Categoria(novaCategoria).save().then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso.');
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao salvar a categoria.');
                res.redirect('/admin');
            });
        };

    });

module.exports = router;