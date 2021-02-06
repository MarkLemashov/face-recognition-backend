const imagePut = (db, clarifai) => (req, res) => {
    const { image_url } = req.body;
    const email = req.user;
    clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, image_url)
        .then(response => {
            num_of_faces_detected = response.outputs[0].data.regions.length;

            // res.status(200).json(response.outputs[0].data.regions); 
            db('users').where('email', email).increment({entries: 1, faces_detected: num_of_faces_detected}).then(
                db.select('*').from('users').where('email', email).then(user => {
                    res.status(200).json({user: user, regions: response.outputs[0].data.regions});
                })
            );
          }
        )
        .catch(err => res.status(400).json('image link error'));
}

module.exports = {
    imagePut: imagePut,
};