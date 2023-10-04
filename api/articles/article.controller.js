const express = require('express');

const Article = require('./article.model');

class ArticleController {
    createArticle(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            author: req.user._id 
        });

        newArticle.save().then(article => {
            res.json(article);
        }).catch(err => {
            res.status(400).json(err);
        });
    }

    updateArticle(req, res) {
        const { title, content, status } = req.body;

        Article.findById(req.params.id)
            .then(article => {
                if (!article) {
                    return res.status(404).json({ message: 'Article non trouvé.' });
                }

                article.title = title;
                article.content = content;
                article.status = status;

                article.save()
                    .then(updatedArticle => res.json(updatedArticle))
                    .catch(err => res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article.', error: err }));
            })
            .catch(err => res.status(500).json({ message: 'Erreur lors de la recherche de l\'article.', error: err }));
    }

    deleteArticle(req, res) {
        Article.findById(req.params.id)
            .then(article => {
                if (!article) {
                    return res.status(404).json({ message: 'Article non trouvé.' });
                }

                article.remove()
                    .then(() => res.json({ message: 'Article supprimé avec succès.' }))
                    .catch(err => res.status(500).json({ message: 'Erreur lors de la suppression de l\'article.', error: err }));
            })
            .catch(err => res.status(500).json({ message: 'Erreur lors de la recherche de l\'article.', error: err }));
    }
}

module.exports = ArticleController;
