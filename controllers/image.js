const imagePut = (db) => (req, res) => {
    const { email } = req.body;
    res.status(200).json('success')
    db('users').where('email', email).increment({entries: 1}).then();
}

module.exports = {
    imagePut: imagePut,
};