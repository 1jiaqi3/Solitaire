'use strict';

let express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    shufLogger      = require('morgan'),
    _               = require('underscore'),
    shuffle         = require('./shuffle'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    bcrypt         = require('bcryptjs'),
    models          = require('./userModel'),
    validation      = require('./validation');

const SALT_FACTOR = 10;

mongoose.connect('mongodb://192.168.99.100:32769/liuj19');

let User = models.User;
let Game = models.Game;

let MemoryStore = session.MemoryStore;
let app = express();

let staticPath = path.join(__dirname, '../../public');
let viewPath = path.join(__dirname, '../../src/server/views');

app.set('view engine', 'pug');
app.set('views', viewPath);
app.use(express.static(staticPath));
app.use(logger('combined'));
shufLogger.token('shuffle', function () {
    return "HI I am Shuffle!";
});
app.use(shufLogger(':shuffle', {
    skip: function (req, res) {
        return req.url !== '/v1/game/shuffle?joker=false';
    }
}));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(
    {   secret: "secret",
        store: new MemoryStore(),
        expires: new Date(Date.now() + (30 * 86400 * 1000)),
        saveUninitialized: true,
        resave: true,
    }));


let games = [];

let sess;

shuffle(app);

app.get('/', function(req, res) {
    res.render('base', {
        title: 'Landing'
    });
});


app.get('/v1/game/:gameID', function (req, res) {
    sess.game.name = req.params.gameID;
    Game.findOne({name: sess.game.name}, function (err, game) {
        //console.log(sess.game.name);
        if (err) {
            res.status(401).send({error: 'Game not exist'});
        } else {
            let len = game.states.length;
            res.status(201).json(game.states[len - 1]);
        }
        //console.log(game);
        //console.log("SUCCESSFULLY PUSHED!!!!!!");
    });
});

app.put('/v1/game/:gameID', function (req, res) {
    let contains = function (single, set) {
        for (let k = 0; k <= set.length; k++) {

            if (JSON.stringify(set[k]) === JSON.stringify(single)) {
                console.log("found you!!!");
                return true;
            }
        }
        return false;
    };
    //let stateAndMove = JSON.parse(req.body);
    let stateAndMove = req.body;
    //console.log(stateAndMove);
    let state = stateAndMove.state;
    //console.log(state);
    let move = stateAndMove.move;
    move.cards[0].value = parseInt(move.cards[0].value);
    //console.log(move);
    if (sess && sess.username && sess.game.owner === sess.username && sess.game.name === req.params.gameID) {
        let validMoves = validation(state);
        console.log(move);
        /*
         for (let m = 0; m < validMoves.length; m++) {
         console.log(validMoves[m]);
         }
         */
        if (contains(move, validMoves)) {
            /*
            Game.findOne({name: sess.game.name}, function (err, game) {
                //console.log(sess.game.name);
                game.states.push(JSON.stringify(state));
                game.save();
                //console.log(game);
                //console.log("SUCCESSFULLY PUSHED!!!!!!");
            });
            */
            res.status(201).send({});
        } else {
            res.status(400).send({error: 'invalid move!'});
        }
    } else {
        res.status(401).send({error: 'you are not the owner of the game'})
    }
});
// Handle POST to create a user session

app.put('/v1/update', function (req, res) {
    let state = req.body.state;
    Game.findOne({name: sess.game.name}, function (err, game) {
        //console.log(sess.game.name);
        game.states.push(JSON.stringify(state));
        game.save();
        //console.log(game);
        //console.log("SUCCESSFULLY PUSHED!!!!!!");
    });
    res.status(201).send({});
});

app.get('/logout', function (req, res) {
    if (sess && sess.username) {
        sess.username = null;
    }
    res.status(200).send({});
});


//user loggin
app.post('/v1/session', function(req, res) {
    sess = req.session;
    let data = req.body;
    if (!data) {
        res.status(400).send({ error: 'username and password required' });
    }
    User.findOne({username: data.username}, function (err, user) {
        if (err) {
            res.status(400).send({ error: 'username and password required' });
        }
        if (!user) {
            res.status(400).send({ error: 'no user found!' });
        } else {
            bcrypt.hash(data.password, user.salt, function (hashErr, hash) {
                if (hashErr) {
                    throw hashErr;
                }
                data.password = hash;
                if (data.password != user.password) {
                    res.status(401).send({error: 'unauthorized'});
                } else {
                    sess.username = user.username;
                    sess.email = user.primary_email;
                    res.status(201).send({
                        username: user.username,
                        primary_email: user.primary_email
                    });
                }
            });
        }
    });
});


//user edit
app.post('/edit', function (req, res) {
    let data = req.body;
    User.findOne({username: sess.username}, function (err, curUser) {
        if (err) {
            res.status(400).send({error: 'query error occurred'});
        }
        if (!(data.username && data.password && data.first_name && data.last_name)) {
            res.status(400).send({ error: 'all form fields required' });
        }
        curUser.username = data.username;
        curUser.password = data.password;
        curUser.first_name = data.first_name;
        curUser.last_name = data.last_name;
        sess.username = data.username;
        //console.log(curUser.salt);
        curUser.save();
        res.status(201).send(data);
    });
});


// Handle POST to create a new user account
app.post('/v1/user', function(req, res) {
    let data = req.body;

    let user = new User({
        username: data.username,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        primary_email: data.primary_email,
    });

    bcrypt.genSalt(SALT_FACTOR, function (saltErr, salt) {
        if (saltErr) {
            throw saltErr;
        }
        user.salt = salt;
    });

    User.findOne({username: user.username}, function (err, newUser) {
        if (err) {
            res.status(400).send({error: 'query error occurred'});
        }
        if (newUser) {
            res.status(401).send({ error: 'username already in use' });
        } else {
            user.save(function (err) {
                if (err) {
                    res.status(400).send({ error: 'username, password, first_name, last_name and primary_email required' });
                } else {
                    res.status(201).send({
                        username:       data.username,
                        primary_email:  data.primary_email
                    });
                }
            });
        }
    });
});


//get curent user
app.get('/v1/user/:username', function (req, res) {
    if (sess && sess.username) {
        let user = User.findOne({username: req.params.username}, function (err, curUser) {
            if (err) {
                res.status(400).send({error: 'query error occured. Perhaps you have not logged in'});
            }
            if (!user) {
                res.status(404).send({error: 'unknown user'});
            } else {
                res.status(200).send(curUser);
            }
        });
    }
});
// Handle POST to create a new game
app.post('/v1/game', function(req, res) {
    let data = req.body;
    if (!sess || !sess.username) {
        res.status(401).send({ error: 'not logged in'});
    } else {
        let game = new Game({
            Players: [],
            Type: data.Type,
            num_players: data.num_players,
            name: data.name,
            Deck: data.Deck,
            draw_num: data.draw_num,
        });
        game.startDate = new Date();
        sess.game = {};
        sess.game.name = data.name;
        sess.game.owner = sess.username;
        Game.find({name: data.name}, function (gErr, games) {
            if (games.length != 0) {
                console.log(games);
                res.status(400).send({ error: 'Game name already in use' });
            } else {
                User.findOne({username: sess.username}, function (qErr, user) {
                    if (qErr) {
                        res.status(401).send({error: 'query error occured!'});
                    } else {
                        game.Creator = user._id;
                        game.Players.push(user._id);
                        //console.log(game);
                        game.save();
                    }
                });
                res.status(200).send({});
            }
        });
    }
});



app.get('/games/:username', function (req, res) {
    let games = [];
    if (sess && sess.username) {
        Game.find({})
            .populate('Creator')
            .exec(function (err, allGames) {
                if (err) {
                    res.status(400).send({error: 'query error occured'});
                } else {
                    //console.log(allGames);
                    for (let i = 0; i < allGames.length; i++) {
                        if (allGames[i].Creator.username === req.params.username) {
                            games.push(allGames[i]);
                        }
                    }
                    //console.log(games);
                    res.status(201).send(JSON.stringify(games));
                }
            });
    }
});

app.get('/v2/game/:name', function (req, res) {
    Game.findOne({name: req.params.name})
        .populate('Creator')
        .exec(function (err, game) {
            if (err) {
                res.status(400).send({error: 'query error occurred'});
            } else {
                res.status(200).send(game);
            }
        });
});

let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});
