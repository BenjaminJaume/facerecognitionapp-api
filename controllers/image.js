const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'a466bb16792d4c3796bf4e2486f3a217'
});

const handleAPIcall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'));
};

const handleImage = db => (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage,
  handleAPIcall
};
