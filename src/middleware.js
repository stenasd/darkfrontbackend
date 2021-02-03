//all middelware in a neat place
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');

exports.initRestMiddleware = function initRestMiddleware(app) {
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  //in production set secure true in session
};