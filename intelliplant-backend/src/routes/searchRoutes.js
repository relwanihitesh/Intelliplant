const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/auth.middleware');
const { searchDocuments , semanticSearch } = require('../controller/searchController');

router.get('/documents', authUser, searchDocuments);
router.get('/semantic', authUser, semanticSearch);

module.exports = router;