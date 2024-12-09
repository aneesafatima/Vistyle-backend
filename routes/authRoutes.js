const express = require('express');
const authController = require('../controllers/authController');
const {signUp,logIn} = authController; 
const router = express.Router();
router.post('/signup', signUp);
router.post('/login', logIn);
module.exports = router;