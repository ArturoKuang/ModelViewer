const models = require('../models');

const Scene = models.Scene;

const makerPage = (req, res) => {
  Scene.SceneModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), Scenes: docs });
  });
};


const makeScene = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'RAWR! Name, age, and favorite level are required' });
  }

  const SceneData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newScene = new Scene.SceneModel(SceneData);

  const ScenePromise = newScene.save();

  ScenePromise.then(() => res.json({ redirect: '/maker' }));

  ScenePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Scene already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ScenePromise;
};

// deletes a Scene from the database
const deleteScene = (req, res) => Scene.SceneModel.deleteById(req.body.SceneId, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ Scenes: docs });
});

const getScenes = (request, response) => {
  const req = request;
  const res = response;

  return Scene.SceneModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ Scenes: docs });
  });
};


module.exports.makerPage = makerPage;
module.exports.getScenes = getScenes;
module.exports.make = makeScene;
module.exports.delete = deleteScene;
