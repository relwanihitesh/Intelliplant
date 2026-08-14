const express = require('express');
const router = express.Router();
const { getProfile } = require('../controller/usercontroller');
const { authUser } = require('../middleware/auth.middleware');
const { updateProfile } = require('../controller/usercontroller');
const { deleteProfile } = require('../controller/usercontroller');

const { changePassword } = require('../controller/usercontroller');

router.get('/profile', authUser, getProfile);

router.put('/profile', authUser, updateProfile);

router.delete('/profile', authUser, deleteProfile);

router.put('/change-password', authUser, changePassword);

module.exports = router;
