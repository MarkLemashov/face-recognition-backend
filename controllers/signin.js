const signinPost = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body
    db.select('hash').from('login').where('email', email)
        .then(data => {
            if(data.length > 0){
                bcrypt.compare(password, data[0].hash).then(function(result, err) {
                    if(err){
                        res.status(400).json(err);
                    }

                    if(result) {
                        db.select('*').from('users').where('email', email).then(user => res.status(200).json(user));
                    }
                    else {
                        res.status(400).json('incorrect credentials');
                    }
                });
            }
            else {
                res.status(400).json('incorrect credentials');
            }
        })
};

module.exports = {
    signinPost: signinPost,
};