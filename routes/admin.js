const express = require('express');
const router = express.Router();

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
        res.send('Página de categorias');
    });

module.exports = router;