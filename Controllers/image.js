const Clarifai = require('clarifai') ;

//moved clarifai api in the backend since there was a security alert in which the api key was visible
const app = new Clarifai.App({
 apiKey: 'f394b94dbd4f4211a13bbdec1c987b57'
});

const handleApiCall = (req,res) => {
      app.models.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
      .then(data => {
            res.json(data);
      })
      .catch(err => res.status(400).json("Wrong with api calls"));
}

const handleImage = (req,res,db) => {
	const {id} = req.body;
   db('users')
  .where('id', '=', id)
  .increment('entry', 1)
  .returning('entry').then(entry => res.json(entry[0].entry)) //.entry is mentioned at the end since the knex returns array object instead of an array
  .catch(err => res.status(400).json('error'))
}

module.exports = {
      handleImage,
      handleApiCall
   }