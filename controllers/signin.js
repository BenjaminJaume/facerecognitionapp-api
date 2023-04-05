const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Unable to Sign In');
  }
  db.select('email', 'passhash')
    .from('login')
    .where({ email: email })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].passhash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where({ email: email })
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
