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
        Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
            res.render('admin/categorias', {categorias: categorias});
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias');
            res.redirect('/admin');
        });
    });

// Rota para o formulário
    router.get('/categorias/add', (req, res) => {
        res.render('admin/addcategorias');
    });

// Rota para update de categoria
    router.get('/categorias/edit/:id', (req, res) => {
        Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {

            res.render('admin/editcategorias', {categoria: categoria});

        }).catch(err => {
            req.flash('error_msg', 'Esta categoria não existe');
            res.redirect('/admin/categorias');
        })
    });

    router.post('/categorias/edit', (req, res) => {

        Categoria.findOne({_id: req.body.id}).then((categorias) => {
            
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
                categorias.nome = req.body.nome
                categorias.slug = req.body.slug

                categorias.save().then(() => {
                    req.flash('success_msg', 'Categoria editada com sucesso.')
                    res.redirect('/admin/categorias')
                }).catch(err => {
                    req.flash('error_msg', 'Houve um erro interno ao salvar a edição de categoria.')
                    res.redirect('/admin/categorias');
                })         
            }
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao editar a categoria.');
            res.redirect('/admin/categorias');
        })
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

// Rota responsável por deletar uma categoria.
    router.post('/categorias/deletar', (req, res) => {
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso.');
            res.redirect('/admin/categorias');
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao deletar a categoria.');
            res.redirect('/admin/categorias');
        });
    });
module.exports = router;