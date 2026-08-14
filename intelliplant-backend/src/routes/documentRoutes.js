const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/auth.middleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadDocument , getAllDocuments , getSingleDocument , deleteDocument} = require('../controller/documentController');

router.post('/upload', authUser, upload.single('file'), uploadDocument);

router.get('/all', authUser, getAllDocuments);

router.get('/single/:id', authUser, getSingleDocument);

router.delete('/delete/:id', authUser, deleteDocument);

module.exports = router;