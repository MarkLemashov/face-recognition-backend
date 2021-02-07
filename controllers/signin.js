const signinPost = (db, bcrypt, jwt, ACCESS_TOKEN_SECRET) => (req, res) => {
    const {email, password} = req.body
    db.select('hash').from('login').where('email', email)
        .then(data => {
            if(data.length > 0){
                bcrypt.compare(password, data[0].hash).then(function(result, err) {
                    if(err){
                        res.status(404).json(err);
                    }

                    if(result) {
                        db.select('*').from('users').where('email', email).then(user => {
                            // res.status(200).json(user);
                            const accessToken = jwt.sign({email: user[0].email}, ACCESS_TOKEN_SECRET, { expiresIn : "5s"});
                            res.status(200).json({user: user[0], accessToken: accessToken});
                        });
                    }
                    else {
                        res.status(404).json('Incorrect credentials');
                    }
                });
            }
            else {
                res.status(404).json('Incorrect credentials');
            }
        })
};

module.exports = {
    signinPost: signinPost,
};