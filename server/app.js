const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandleBars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
<<<<<<< HEAD
=======
const csrf = require('csurf');
>>>>>>> b1f8a4eb082a1f3cece831323374401a1b9badeb

const port = process.env.PORT || process.env.NODE_PORT || 3001;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

mongoose.connect(dbURL, (err) => {
    if(err) {
        console.log('Could not connect to database');
        throw err;
    }
});

<<<<<<< HEAD
let redisURL = {
    hostname: 'localhost',
=======
let redisURL =  {
    hostname: 'localhost', 
>>>>>>> b1f8a4eb082a1f3cece831323374401a1b9badeb
    port: 6379,
};

let redisPASS;

if(process.env.REDISCLOUD_URL){
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(':')[1];
}

<<<<<<< HEAD

=======
>>>>>>> b1f8a4eb082a1f3cece831323374401a1b9badeb
//pull in out routes 
const router = require('./router.js');

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
    extended:true,
}));
app.use(session({
    key: 'sessionid',
    store: new RedisStore({
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS,
    }),
    secret: 'Domo Arigato',
    store: new RedisStore({
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS,
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));
app.engine('handlebars', expressHandleBars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());
app.use(csrf());
app.use((err, req, res, next) => {
    if(err.code !== 'EBADCSRFTOKEN') return next(err);
    console.log('Missing CSRF token');
    return false;
});

router(app);

app.listen(port, (err) => {
    if(err){
        throw err;
    }
    console.log(`Listening on port ${port}`);
});
