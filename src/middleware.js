//all middelware in a neat place
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const passport = require('passport');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
const myDatabase = require('../db/index')
const sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});





exports.initRestMiddleware = function initRestMiddleware(app) {

  app.use(expressSession({
      secret: 'keep it secret, keep it safe.',
      store: sequelizeSessionStore,
      resave: false,
      saveUninitialized: false,
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  //in production set secure true in session
};