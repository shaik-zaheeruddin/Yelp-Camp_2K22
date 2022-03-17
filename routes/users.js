const express = require('express')
const Router = express.Router()
const passport = require('passport')
const users = require('../controllers/userControllers')

Router.route('/register')
    .get(users.index)
    .post(users.update)

//passport local functions are async

Router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

Router.get('/logout', users.logout)
module.exports = Router