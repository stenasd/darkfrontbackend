var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const controller = require('./controller');
const verifyer = require('../../securityUtil')
passport.use(new Strategy(
    function (username, password, cb) {
        controller.findByUsername(username, function (err, user) {

            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            console.log(user.pass + " " + password);
            if (user.pass != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
    controller.findById(id, function (err, user) {

        if (err) { return cb(err); }
        cb(null, user);
    });
});
exports.route = async function route(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.post('/logout', function (req, res) {
        console.log("logout");
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });
    app.post('/signup', async function (req, res) {
        console.log(req.body.signupobj);
        let signres = await controller.signup(req.body.signupobj)
        console.log(signres)
        res.status(200).json(signres);
    });
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });
    app.get("/checkAuthentication", (req, res) => {
        if (typeof req.user !== 'undefined') {
            if (verifyer.veifyUser(req.user.name)) {
                res.status(200).json({

                    authenticated: true,
                });
            }
            console.log(req.sessionID);

        }
        else {
            res.status(400).json({
                authenticated: false,
            });
        }

    });
    app.get("/getSessionid", (req, res) => {
        if (typeof req.user !== 'undefined') {
            if (verifyer.veifyUser(req.user.name)) {
                res.status(200).json({

                    sessionID: req.sessionID,
                });
            }
            console.log(req.sessionID);

        }
        else {
            res.status(400).json({
                authenticated: false,
            });
        }

    });




};
