const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwnder(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'RAWR! Both name, age, and level are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

//allows us to get JSON responses of Domos for a user
//allows our client app to update dynamically using React
//updates are dynamically grabbed and the UI screen immediately updates
const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwnder(req.session.account._id,(err, docs) => {
    if(err){
      console.log(err);
      return res.status(400).json({error: 'An error occured'});
    }

    console.dir(docs);
    return res.json({domos:docs});
  });
}


module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
