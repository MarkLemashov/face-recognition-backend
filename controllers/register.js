const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return(re.test(email));
}

const validatePassword = (password) => {
    const re = /\S\S\S\S+/; //at least 4 characters (no white spaces)
    return(re.test(password));
}

const validateName = (name) => {
    const re = /[a-zA-Z]{1,20}/;
    return(re.test(name));
}
const registerPost = (db, bcrypt, saltRounds) => (req, res) => {
    const { email, name, password } = req.body;

    if(validateName(name)){
        if(validateEmail(email)){
            if(validatePassword(password)){
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
                .catch(err => res.status(400).json('error inserting into database'));
            }
            else {
                res.status(400).json('password must contain at least 4 non white space characters');
            }
        }
        else{
            res.status(400).json('invalid email address');
        }
    }
    else{
        res.status(400).json('name must be between 1-20 characters long and can only contain letters');
    }
}

module.exports = {
    registerPost: registerPost,
};