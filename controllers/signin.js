const handleSignin = (db, bcrypt) => (req, res) => {
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
};

module.exports = {
  handleSignin: handleSignin
};
