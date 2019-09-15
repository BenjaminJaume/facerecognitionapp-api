const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT;

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

app.post('/signup', signup.handleSignup(db, bcrypt, saltRounds));
app.post('/signin', signin.handleSignin(db, bcrypt));
app.get('/profile:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));
app.post('/imageUrl', (req, res) => {
  image.handleAPIcall(req, res);
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
