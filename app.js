var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var pg = require('pg');
//var conString = "postgres://kunrudnqpirtmm:88ba07b033ee4deadf3548b2a42fc2993a4b27ac9f1b380b0669ffa89b4f04a3@ec2-54-243-150-10.compute-1.amazonaws.com:5432/d5n9il5q8huoqp";

// function query(sql, params, callback) {
    // pg.connect(conString, function(err, client, done) {

      // if (err) {
        // return console.error('error fetching client from pool', err);
      // }
      // client.query(sql, params, function(err, result) {
        // done();
        // if (err) {
          // return console.error('error running query', err);
        // }
        // if (callback) {
            // callback(err, result);
        // }   
      // });

    // });
// };

// function create(item, callback) {
    // query('insert into list (text) values ($1)', [item.text], callback);
// }

// function read(callback) {
    // query('select * from list', [], function (err, result) { 
        // callback(err, result);
    // });
// }

// function readById(id, callback) {
    // query('select * from list where id = $1', id, callback);
// }

// function update(id, text, callback) {
    // query('update list set text = $1 where id = $2', [text, id], callback);
// }

// function del(id, callback) {
    // query('delete from list where id = $1', id, callback);
// }

passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username != 'user') {
            return done(null, false, {message: 'Неверный логин.'});
        };
        if (password != '123') {
            return done(null, false, {message: 'Неверный пароль.'});
        }
        var user = {id: 1, login: 'user'};
        return done(null, user);
    }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    if (id == 1) {
        done(null, {id: 1, login: 'user'});
    } else {
        done({message: 'Invalid user-id'});
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.send('Hello World!');
});

// app.get('/login', function (req, res) {
    // res.render('login');
// });

// app.post('/login', passport.authenticate('local', 
        // { successRedirect: '/items',
          // failureRedirect: '/login'}));

// app.all(/^\/items.*/, ensureLoggedIn('/login'), function (req, res, next) {
    // next();
// });

// app.get('/items', function (req, res) {
    // read(function (err, result) {
        // res.render('list', {list: result.rows});
    // });
// });

// app.get('/items/add', function (req, res) {
    // res.render('form', {item: {text: ''}});
// });

// app.post('/items/add', function (req, res) {
    // create({text: req.body.text},
        // function () {
            // res.redirect('/items');    
        // });
// });

// app.get('/items/delete/:id', function (req, res) {
    // del(req.params.id, function () {
        // res.redirect('/items');
    // });
// });

// app.get('/items/edit/:id', function (req, res) {
    // readById(req.params.id, function (err, result) {
        // res.render('form', {item: result.rows[0]});
    // });
// });

// app.post('/items/edit/:id', function (req, res) {
    // update(req.params.id, req.body.text, function () {
        // res.redirect('/items');
    // });
// });
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
