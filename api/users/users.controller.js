const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const usersService = require("./users.service");

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await usersService.get(id);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      console.log(req.body);
      const user = await usersService.create(req.body);
      user.password = undefined;
      res.status(201).json(user);
    } catch (error) {
      console.error("Error registering user:", error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userModified = await usersService.update(id, data);
      userModified.password = undefined;
      res.json(userModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await usersService.delete(id);
      req.io.emit("user:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userId = await usersService.checkPasswordUser(email, password);
      if (!userId) {
        throw new UnauthorizedError();
      }
      res.json({ token: jwt.sign({ userId }, config.secretJwtToken, { expiresIn: '3d' }) });
    } catch (err) {
      next(err);
    }
  }

  async getUserArticles(req, res, next) {
    try {
      const articleQuery = articleService.find({ userId: req.params.userId }).populate('articles').lean().exec();
      const token = req.headers['x-access-token'];
      if (token) {
        articleQuery.setHeaders({ Authorization: `Bearer ${token}` });
      }
      const user = await userService.findById(req.params.userId)
        .select('-password') // Exclude the password
        .populate('articles'); // Populate the articles

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
