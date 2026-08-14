const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/auth.middleware');
const { authAdmin } = require('../middleware/role.middleware');
const { createDepartment, getAllDepartments, updateDepartment, deleteDepartment } = require('../controller/departmentController');

router.post('/create', authUser, authAdmin, createDepartment);

router.get('/all', authUser, getAllDepartments);

router.put('/update/:id', authUser, authAdmin, updateDepartment);

router.delete('/delete/:id', authUser, authAdmin, deleteDepartment);

module.exports = router;