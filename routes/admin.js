const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');
const {eAdmin} = require('../helpers/eAdmin');
const {logado} = require('../helpers/logado');
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
    router.get('/categorias/add', logado, (req, res) => {
        res.render('admin/addcategorias');
    });

// Rota para update de categoria
    router.get('/categorias/edit/:id', logado,(req, res) => {
        Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {

            res.render('admin/editcategorias', {categoria: categoria});

        }).catch(err => {
            req.flash('error_msg', 'Esta categoria não existe');
            res.redirect('/admin/categorias');
        })
    });

    router.post('/categorias/edit', logado, (req, res) => {

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
    router.post('/categorias/nova', logado, (req, res) => {
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
    router.post('/categorias/deletar', eAdmin, (req, res) => {
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso.');
            res.redirect('/admin/categorias');
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao deletar a categoria.');
            res.redirect('/admin/categorias');
        });
    });

// Rota responsável por postagens
    router.get('/postagens', (req, res) => {

        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('admin/postagens', {postagens: postagens});
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as postagens.');
            res.redirect('/admin/')
        })
        
    });

    router.get('/postagens/add', logado, (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render('admin/addpostagem', {categorias: categorias});
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário');
        });
    });
    
// Rota para salvar postagens no banco de dados
    router.post('/postagens/nova', logado, (req, res) => {
        // tenho que fazer validação
        var erros = [];

        if(req.body.categoria === '0'){
            erros.push({texto: 'Categoria inválida, registre uma categoria.'});
        };

        if(erros.length > 0){
            res.render('admin/addpostagem', {erros: erros});
        } else {
            const novaPostagem = {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
                slug: req.body.slug
            }
            new Postagem(novaPostagem).save().then(() => {
                req.flash('success_msg', 'Postagem criada com sucesso.');
                res.redirect('/admin/postagens');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro durante o salvamento da postagem');
                res.redirect('/admin/postagens')
            });
        };
    });

// Rota para a edição de posts
    router.get('/postagens/edit/:id', logado, (req, res) => {

        Postagem.findOne({_id: req.params.id}).lean().then(postagem => {

            Categoria.find().lean().then(categorias => {
                res.render('admin/editpostagens', {categorias: categorias, postagem: postagem});
            }).catch(err => {
                req.flash('error_msg', 'Houve um erro ao listar as categorias.');
                res.redirect('/admin/postagens');
            });

        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição.');
            res.redirect('/admin/postagens');
        });
    });

// Rota para o salvamento do post
    router.post('/postagem/edit', logado, (req, res) => {
        
        Postagem.findOne({_id: req.body.id}).then(postagem => {
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;

            postagem.save().then(() =>{
                req.flash('success_msg', 'Postagem editada com sucesso.')
                res.redirect('/admin/postagens')
            }).catch(() => {
                req.flash('error_msg', 'Erro ao editar categoria..')
                res.redirect('/admin/categorias')
            });

        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição.');
            res.redirect('/admin/postagens');
        });
    });

// Apagando postagem pelo metódo get, não recomendado.
    router.get('/postagens/deletar/:id', eAdmin, (req, res) => {
        Postagem.remove({_id: req.params.id}).then(() => {
            req.flash('success_msg', 'Postagem deletada com sucesso.');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interdo');
            res.redirect('admin/postagens');
        });
    });

module.exports = router;