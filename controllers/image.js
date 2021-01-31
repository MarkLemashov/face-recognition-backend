const imagePut = (db, clarifai) => (req, res) => {
    const { email, image_url } = req.body;
    clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, image_url)
        .then(response => {
            faces_detected = response.outputs[0].data.regions.length;

            res.status(200).json(response.outputs[0].data.regions);
            db('users').where('email', email).increment({entries: 1, faces_detected: faces_detected}).then();
          }
        )
        .catch(err => res.status(400).json('image link error'));
}

module.exports = {
    imagePut: imagePut,
};