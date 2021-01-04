const registerPost = (db, bcrypt, saltRounds) => (req, res) => {
    const { email, name, password } = req.body;
    db.select('email').from('login').where('email', email).then(data => {
        if(data.length > 0) {
            res.status(400).json('email exists');
        }
        else {
            db.transaction(trx => {
                trx('users').insert({
                    email: email,
                    name: name,
                    joined: new Date(),
                }).then(() =>{
                    bcrypt.hash(password, saltRounds).then(hash => {
                        trx('login').insert({
                            email: email,
                            hash: hash,
                        })
                        .then(x => {
                            trx.commit(x);
                            res.status(200).json('success');
                        })
                        .catch(x => {
                            trx.rollback(x);
                            res.status(400).json('error inserting into database');
                        })
                    });
                });
            })
        }
    })
    .catch(err => 'unable to register');
}

module.exports = {
    registerPost: registerPost,
};