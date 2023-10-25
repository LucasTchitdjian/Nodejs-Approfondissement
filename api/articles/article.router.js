const express = require('express');
const router = express.Router();
const Article = require('./article.model');


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
router.post('/articles', ensureAuthenticated, (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        author: req.user._id
    });
    article.save((err, savedArticle) => {
        if (err) return res.status(500).send(err);
        // Envoi d'un événement socket.io pour informer les clients de la création d'un nouvel article
        req.app.get('socketio').emit('article:created', savedArticle);
        res.status(201).send(savedArticle);
    });
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

