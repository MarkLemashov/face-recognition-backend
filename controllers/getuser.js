const getuser = (db) => (req, res) => {
    let email = req.user.email;

    db.select('*').from('users').where('email', email).then(users => {
        res.status(200).json(users[0]);
    })
    .catch(err => res.status(400).json('db error'))
};

module.exports = {
    getuser,
};