require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);
const {flash} = require("express-flash-message")
const csrf = require("csurf");
const app = express();

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const tagRoutes = require('./routes/tags');

const MONGODB_URI = process.env.DATABASE;

const store = new MongoDBStore({uri: MONGODB_URI, collection: 'sessions'})

let csrfProtection = csrf()

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));
app.use(flash({sessionKeyName: 'flashMessage'}));
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    if (req.session.user){
        res.locals.username = req.session.user.username;
    }else{
        res.locals.username = null
    }
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(authRoutes);
app.use(problemRoutes);
app.use(tagRoutes);

app.get("/", (req, res) => {
    res.redirect("/allTags");
});

app.get("/error", (req, res) => {
    res.render("error.ejs", {code: "404"});
});

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('connected to dB');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening in ${PORT}`));
