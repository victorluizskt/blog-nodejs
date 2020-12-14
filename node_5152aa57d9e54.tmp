// Carregando módulos para iniciar a aplicação.
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require("./routes/admin");
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    require('./models/Postagem');
    const Postagem = mongoose.model('postagens');
    const usuarios = require('./routes/usuario');
    const passport = require('passport');
    require('./config/auth')(passport);

// Configurações
    // Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            next();
        });
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // HandleBars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Conectado ao mongo.');
        }).catch((err) => {
            console.log('Erro ao se conectar: ' + err);
        });
    // Public (arquivos estáticos)
        app.use(express.static(path.join(__dirname, 'public')));

// Rotas
    app.get('/posts', (req, res) => {
        res.send('Lista de posts.')
    })

    app.get('/', (req, res) => {
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then(postagens => {
            res.render('index', {postagens: postagens});
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/404');
        });
    });

    app.get('/postagem/:slug', (req,res) => {
        const slug = req.params.slug
        Postagem.findOne({slug}).then(postagem => {
            if(postagem){
            const post = {
            titulo: postagem.titulo,
            data: postagem.data,
            conteudo: postagem.conteudo
            }
                res.render('postagem/index', post)
            } else {
                req.flash("error_msg", "Essa postagem nao existe")
                res.redirect("/")
                }
            }).catch(err => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("/")
        });
    });

    app.get('/404', (req, res) => {
        res.send('Error 404');
    });

    app.use('/usuarios', usuarios);
    app.use('/admin' , admin);

// Outros
    const PORT = 8081;
    app.listen(PORT, () => {
        console.log('Servidor rodando!')
    });