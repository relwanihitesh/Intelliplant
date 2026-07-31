const express = require('express');
const router = express.Router();
const {controller} = require('../controller/authcontroller');
const { registerUser , loginUser , verifyEmail } = require('../controller/authcontroller');


router.post('/register' , registerUser);

router.post('/login' ,loginUser);

router.post('/verify-email', verifyEmail);

module.exports = router;