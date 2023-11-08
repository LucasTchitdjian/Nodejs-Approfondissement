const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth");
const User = require('../users/users.model');
const Article = require('../articles/article.model');

router.get("/", usersController.getAll); // No auth required
router.get("/:id", authMiddleware, usersController.getById); // Auth required
router.post("/create", usersController.create);
router.put("/:id", authMiddleware, usersController.update); // Auth required
router.delete("/:id", authMiddleware, usersController.delete); // Auth required


// Endpoint pour afficher les articles d'un utilisateur
router.get('/:userId/articles', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password'); // Sélectionne tous les champs de l'utilisateur sauf le mot de passe
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const articles = await Article.find({ author: userId }).populate('author', '-password'); // Récupère les articles de l'utilisateur et popule les informations de l'auteur (sans le mot de passe)
    res.json({ user, articles });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des articles de l\'utilisateur', error: error.message });
  }
});

module.exports = router;

module.exports = router;
