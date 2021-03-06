//all middelware in a neat place
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
const myDatabase = require('../db/index')
var exphbs  = require('express-handlebars');
const sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});
exports.initRestMiddleware = function initRestMiddleware(app) {
  app.use(express.static('images'));
  app.use(expressSession({
      secret: 'keep it secret, keep it safe.',
      store: sequelizeSessionStore,
      resave: false,
      saveUninitialized: false,
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  app.engine("handlebars", exphbs());
  app.set("view engine", "handlebars");
  //in production set secure true in session
};