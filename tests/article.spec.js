const mongoose = require('mongoose');
const Article = require('./article.model');
const mockingoose = require('mockingoose').simulator;

describe('Article model', () => {

  let article;

  beforeEach(() => {
    article = new Article({});
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  it('creates an article', async () => {

    mockingoose(Article).toReturn(article, 'save');

    await article.save();

    expect(article._id).toBeDefined();

  });

  it('updates an article', async () => {

    mockingoose(Article).toReturn({updatedAt: new Date()}, 'updateOne');

    article.title = 'New title';
    await article.save();

    expect(article.title).toBe('New title');

  });

  it('deletes an article', async () => {

    mockingoose(Article).toReturn({n: 1}, 'deleteOne');

    await article.remove();

    const found = await Article.findById(article._id);
    expect(found).toBeNull();

  });

});