var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
var port = 8080;
app.set('views', __dirname + '/pages');
app.set('view engine', 'ejs');

var users = [
    {username: "admin", password: '030580'},
    {username: 'gleb', password: '150908'},
    {username: 'alesia', password: '210981'}
];

// session store
var sessionHandler = require('./js/session_handler');
var store = sessionHandler.createStore();

// handler for cookie parse
app.use(cookieParser());
//create session
app.use(session({
    store: store,
    resave: false,
    saveUninitialized: true,
    secret: 'supersecret'
}));



app.get('/', function(req, res){
    res.render('sign_up');
});

app.post('/signup', function (req, res) {
    var user = {
        username: req.body.username,
        password: req.body.password
    };
    users.push(user);
    console.log(users);
    res.status(200).send('User successfully created!');
});

 app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
 });

app.post('/login', function (req, res){
    var foundUser;

        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            if (u.username == req.body.username && u.password == req.body.password ) {
                foundUser = u.username;
                break;
            }
        }
        if (foundUser !== undefined) {
            req.session.username = foundUser;
            console.log('Login succeeded', req.session.username);
            res.send('Login succesful: sessionID: '+ req.session.id + '; user: ' + req.session.username );
        } else {
            console.log('Login failed', req.body.username);
            res.status(401).send('Login error');
        }
    });

app.get('/check', function(req, res){
    if (req.session.username) {
        res.setHeader('Content-Type', 'text/html');
        res.send('<h2> User ' + req.session.username + ' is logged in!</h2>');
    } else {
        res.send('not logged in');
    }
})

app.get('/logout', function(req, res) {
    req.session.username = '';
    console.log('logged out');
    res.send('logged out!');
})

app.get('/admin', function(req, res) {
    if (req.session.username == 'admin') {
        console.log(req.session.username + ' requested admin page')
        res.render('admin_page');
    } else {
        res.status(403).send('Access denied');
    }
});

app.get('/user', function(req, res) {
    if (req.session.username.length > 0) {
        console.log(req.session.username + ' requested user page');
        res.render('user_page', {data: req.session.username});
    } else {
        res.status(403).send('Access denied');
    }
});

app.get('/guest', function(req, res) {
    res.render('guest_page');
});

app.listen(port, function(){
    console.log("App established connection on port " + port);
})