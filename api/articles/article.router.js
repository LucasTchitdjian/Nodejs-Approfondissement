const express = require('express');
const router = express.Router();
const Article = require('./article.model');
const authenticateToken = require("../../middlewares/authenticateToken");
const usersController = require("../users/users.controller");
const ArticleController = require("../articles/article.controller");


// Middleware
router.use(authenticateToken);

router.get('/users/:userId/articles', authenticateToken, usersController.getUserArticles); // Afficher articles d'un utilisateur


// Middleware pour vérifier l'authentification
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

// Middleware pour vérifier le rôle d'administrateur
function ensureAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).send('Forbidden');
    }
}

// Création d'un article
router.post('/articles/:userId/create', async (req, res) => {
    console.log('Article create route hit');
    
    await ArticleController.createArticleForUser(req, res);
    console.log(req.body)
  });

// Mise à jour d'un article
router.put('/articles/:id', ensureAuthenticated, ensureAdmin, (req, res) => {
    Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedArticle) => {
        if (err) return res.status(500).send(err);
        // Envoi d'un événement socket.io pour informer les clients de la mise à jour de l'article
        req.app.get('socketio').emit('article:updated', updatedArticle);
        res.send(updatedArticle);
    });
});

// Suppression d'un article
router.delete('/articles/:id', ensureAuthenticated, ensureAdmin, (req, res) => {
    Article.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.status(500).send(err);
        // Envoi d'un événement socket.io pour informer les clients de la suppression de l'article
        req.app.get('socketio').emit('article:deleted', req.params.id);
        res.status(204).send();
    });
});

module.exports = router;

