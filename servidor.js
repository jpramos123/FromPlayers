var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')


var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var servidor = http.createServer(app);
servidor.listen(8080);

var esquemaUser = new mongoose.Schema({
    uLogin: String,
    uSenha: String,
    uNome: String
});

app.get('/cadastra', function(solicitacao, resposta){
    var vNome = solicitacao.query.nome;
    var vLogin = solicitacao.query.login;
    var vSenha = solicitacao.query.senha;

    var novoUsuario = new Usuario({
        uLogin:vLogin,
        uSenha:vSenha,
        uNome:vNome
    });
    novoUsuario.save(function(err){
        if(err) {
            resposta.render('cadastro');
        }
            else{
                resposta.render('index');
            }

    })

})

var Usuario = mongoose.model('cadastro', esquemaUser);
mongoose.connect('mongodb://localhost/fromplayers')

app.use(express.static('public'))

app.get('/', function(solicitacao, resposta){
    resposta.render('index');
})
app.get('/cadastro', function(solicitacao, resposta){
    resposta.render('cadastro.ejs');
})
app.get('/inicio', function(solicitacao, resposta){
    resposta.render('inicio.ejs');
})
app.get('/jogos', function(solicitacao, resposta){
    resposta.render('jogos.ejs');
})
app.get('/avaliacoes', function(solicitacao, resposta){
    resposta.render('avaliacoes.ejs');
})
app.get('/faleconosco', function(solicitacao, resposta){
    resposta.render('faleconosco.ejs');
})

app.get('/usuarios', function(sol, resp){

    Usuario.find(
        function(err, usuarios){
            resp.render('listagem', { lista: usuarios} );
        }
    );

});

app.get('/fazLogin', function(sol, resp){
    var User = sol.query.login;
    var Senha = sol.query.senha;

    Usuario.findOne({uLogin: User, uSenha: Senha},function(err,user){
        if(user == null){
            resp.render('erro')
        }
        else{
            resp.render('inicio')
        }
    })

})



