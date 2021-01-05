const imagePut = (db, clarifai) => (req, res) => {
    const { email, image_url } = req.body;
    clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, image_url)
        .then(response => {
            console.log(response);
            res.status(200).send(response);
            db('users').where('email', email).increment({entries: 1}).then();
          }
        )
        .catch(err => res.status(400).json('image link error'));
}

module.exports = {
    imagePut: imagePut,
};