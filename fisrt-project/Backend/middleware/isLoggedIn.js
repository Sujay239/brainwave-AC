const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();


app.use(cookieParser());


let isLoggedIn = (() => {
   return  req.cookies ? true : false;
});

module.exports = isLoggedIn;