const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const ArticleController = require('./article.controller');

const controller = new ArticleController();

router.post('/create', ensureAuthenticated, controller.createArticle);
router.put('/update/:id', ensureAuthenticated, ensureAdmin, controller.updateArticle);
router.delete('/delete/:id', ensureAuthenticated, ensureAdmin, controller.deleteArticle);

module.exports = router;
