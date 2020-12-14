const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});


router.post('/registro', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto: 'Nome inválido.'});
    }

    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null){
        erros.push({texto: 'E inválido.'});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null){
        erros.push({texto: 'Senha inválido.'});
    }

    if(req.body.senha.length < 8){
        erros.push({texto: 'A senha precisa ser maior que 8 digítos.'});
    }
    
    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas são diferentes, tente novamente.'});
    }

    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros});
    } else {
        
    }
});


module.exports = router;