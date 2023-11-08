const express = require('express');

const Article = require('../articles/article.model');

class ArticleController {
    async createArticleForUser(req, res) {
        try {
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content,
                user: req.params.userId
            });

            await newArticle.save();

            res.json(newArticle);
        } catch (err) {
            next(err);
        }
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
    // article.controller.js

    async createArticleForUser(req, res) {

        // Validate request

        try {
            const { title, content } = req.body;

            const newArticle = new Article({
                title,
                content,
                user: req.params.userId
            });

            const article = await newArticle.save();

            res.status(201).json(article);

        } catch (err) {
            res.status(400).json({ message: err.message });
        }


    }

}

module.exports = ArticleController;
