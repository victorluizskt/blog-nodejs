const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome: {
        type: String,
        required: true,
        default: 'undefined'
    },
    slug: {
        type: String,
        required: true,
        default: 'undefined'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('categorias', Categoria);