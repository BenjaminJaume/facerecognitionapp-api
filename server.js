const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.post('/signup', (req, res) => {
  signup.handleSignup(req, res, db, bcrypt, saltRounds);
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.get('/profile:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
