const express = require('express');
const router = express.Router();
const controller = require('../controllers/search.controller');

router.get('/search', controller.searchUsers);
router.get('/filters', controller.getFilterOptions);

module.exports = router;