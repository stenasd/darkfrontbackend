var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const controller = require('./controller');
const verifyer = require('../../securityUtil')
passport.use(new Strategy(
    function(username, password, cb) {
        controller.findByUsername(username, function(err, user) {

            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.pass != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
    controller.findById(id, function(err, user) {

        if (err) { return cb(err); }
        cb(null, user);
    });
});
exports.route = async function route(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.post('/logout', function(req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });
    app.get('/logout', function(req, res) {

        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });
    app.post('/signup', async function(req, res) {
        //username check that its under 20 and over 3
        //nick  check that its under 20 and over 3
        //password use first password check that its under 20 and over 5
        //password2
        //refer
        if (typeof req.user !== 'undefined'){
            console.log(" signup failed loggedin")
            res.status(400)
        }
        else{
            let signres = await controller.signup(req.body.data)
            res.status(200).json(signres);
        }
    });
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/' }),
        function(req, res) {

            res.redirect('/');



        });
    app.get("/checkAuthentication", (req, res) => {
        if (typeof req.user !== 'undefined') {
            if (verifyer.veifyUser(req.user.name)) {

                res.status(200).json({
                    name: req.user.nick,
                    rating: req.user.rating,
                    ratingNr: req.user.ratingNr,
                    authenticated: true,
                });
            }
        } else {
            console.log("checkAuthentication failed")
            res.status(400).json({
                authenticated: false,
            });
        }

    });
    app.get("/getSessionid", (req, res) => {
        //gets session token for socketio auth
        if (typeof req.user !== 'undefined') {
            if (verifyer.veifyUser(req.user.name)) {
                res.status(200).json({
                    sessionID: req.sessionID,
                });
            }

        } else {
            console.log("getSessionid failed");
            res.status(400).json({
                authenticated: false,
            });
        }

    });




};