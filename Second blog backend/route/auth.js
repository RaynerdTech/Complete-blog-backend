const express = require('express');
const route = express.Router()
const { register, loginUser, logout, authRegister } = require('../controllers/auth');
const { verify } = require('../middleware/verify');


route.post('/register', register);
route.post('/login', loginUser);
route.post('/logout', verify, logout);
route.post('/auth', authRegister);

module.exports = route;     