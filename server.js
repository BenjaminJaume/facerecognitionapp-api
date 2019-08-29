const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1234',
    database: 'facerecognitionapp'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

app.get('/', (req, res) => {
  res.send('Welcome to the Back-end side of the website');
});

app.post('/signin', (req, res) => {
  db.select('email', 'passhash')
    .from('login')
    .where({ email: req.body.email })
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].passhash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where({ email: req.body.email })
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials'); // Wrong password
      }
    })
    .catch(err => res.status(400).json('Wrong credentials')); // Wrong email address
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  var salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction(trx => {
    trx
      .insert({
        passhash: hash,
        email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('Unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      user.length ? res.json(user[0]) : res.status(400).json('User not found');
    })
    .catch(err => res.status(400).json('Error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Error while updating entries'));
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
